import {
  LAB_PAYLOAD,
  addAvatarToSection,
  addBodyToSection,
  beginCommentPass,
  commitCommentSection,
  createSimDom,
  FALLBACK_AVATAR,
  formatClobber,
  formatMaybeString,
  isTruthyClobber,
  sanitizeCommentHtml,
  startCommentSection,
  type ClobberValue,
  type CommentPass,
  type DomView,
  type LabComment,
  type LoopState,
  type NamedLookup,
  type SinkResult,
  type ViewOpts,
  serializeSimPage,
  viewPage,
} from './chromium-clobber';
import { APPROX_POST_HTML } from './approx-post-html';
import originalLoaderJs from '../data/scripts/exploiting-dom-clobbering-to-enable-xss/original-vulnerable.js?raw';

export type PaneId = 'script' | 'http' | 'summary';

export interface Watch {
  name: string;
  value: string;
  note: string;
  changed: boolean;
}

export interface ScenarioStep {
  id: string;
  title: string;
  narration: string;
  pane: PaneId;
  jsLines: number[];
  watches: Watch[];
  dom: DomView | null;
  firefoxNote: string;
  sink: SinkResult | null;
  request: string;
  response: string;
  loopLabel: string;
  highlightScripts: boolean;
  pendingDom: DomView | null;
  pageHtml: string;
  pageNote: string;
  pageMark: string;
}

export interface ScenarioPreset {
  id: string;
  label: string;
  hint: string;
  payload: string;
  trigger: boolean;
  carlos: boolean;
}

export interface ScenarioInput {
  payload: string;
  trigger: boolean;
  carlos: boolean;
}

export const CLOBBER_PRESETS: ScenarioPreset[] = [
  {
    id: 'lab',
    label: 'Lab payload',
    hint: 'Two ids, cid: href, second comment. This is the intended solve.',
    payload: LAB_PAYLOAD,
    trigger: true,
    carlos: true,
  },
  {
    id: 'single-id',
    label: 'Single id',
    hint: 'One anchor. Chromium clobbers the name with an element, not a collection, so .avatar is not the href.',
    payload: '<a id=defaultAvatar name=avatar href="cid:&quot;onerror=alert(1)//">',
    trigger: true,
    carlos: true,
  },
  {
    id: 'https',
    label: 'https: instead of cid:',
    hint: 'The quote is percent-encoded for a common web scheme, so innerHTML does not grow a new attribute.',
    payload:
      '<a id=defaultAvatar><a id=defaultAvatar name=avatar href="https://example.com/&quot;onerror=alert(1)//">',
    trigger: true,
    carlos: true,
  },
  {
    id: 'javascript',
    label: 'javascript: href',
    hint: 'The sanitizer drops a javascript: href. Clobbering may still happen, but .avatar is not that URL.',
    payload: '<a id=defaultAvatar><a id=defaultAvatar name=avatar href="javascript:alert(1)">',
    trigger: true,
    carlos: true,
  },
  {
    id: 'no-trigger',
    label: 'No second comment',
    hint: 'Anchors reach the document and clobber window, but no later loop iteration reads the clobbered value.',
    payload: LAB_PAYLOAD,
    trigger: false,
    carlos: true,
  },
];

const JS = {
  loadFn: 1,
  xhrCreate: 2,
  xhrReady: 3,
  xhrIf: 4,
  xhrParse: 5,
  xhrDisplay: 6,
  xhrOpen: 9,
  xhrSend: 10,
  getEl: 19,
  loop: 21,
  commentVar: 23,
  section: 24,
  lookup: 29,
  avatarHtml: 30,
  div: 32,
  sink: 33,
  sanitize: 70,
  appendBody: 72,
  append: 76,
} as const;

function commentsFor(input: ScenarioInput): LabComment[] {
  const list: LabComment[] = [];
  if (input.carlos) {
    list.push({
      name: 'Carlos',
      body: '<b>Nice post!</b>',
      avatar: '',
      date: '2026-08-31T16:29:04.233483167Z',
    });
  }
  const payload = input.payload.trim() || LAB_PAYLOAD;
  list.push({ name: 'x', body: payload, avatar: '' });
  if (input.trigger) {
    list.push({ name: 'x', body: 'x', avatar: '' });
  }
  return list;
}

function httpGet(path: string): string {
  return [
    `GET ${path} HTTP/1.1`,
    'Host: <lab-url>.web-security-academy.net',
    'Cookie: session=<session-cookie>',
  ].join('\n');
}

function httpOk(contentType: string, body: string): string {
  return [`HTTP/1.1 200 OK`, `Content-Type: ${contentType}`, '', body].join('\n');
}

function jsonOf(comments: LabComment[]): string {
  return JSON.stringify(
    comments.map((c) => ({
      avatar: c.avatar,
      website: '',
      date: c.date ?? '2026-08-31T16:29:04.233483167Z',
      body: c.body,
      name: c.name,
    })),
    null,
    2,
  );
}

function watch(
  name: string,
  value: string,
  note: string,
  prev?: Watch[],
): Watch {
  const before = prev?.find((w) => w.name === name)?.value;
  return { name, value, note, changed: before !== undefined && before !== value };
}

function baseWatches(
  lookup: NamedLookup | null,
  defaultAvatar: ClobberValue | null,
  avatarSrc: string | null,
  comment: LabComment | null,
  prev?: Watch[],
): Watch[] {
  const chrome = lookup?.chrome ?? { kind: 'undefined' as const };
  const chromeAvatar = lookup?.chromeAvatar;
  const watches: Watch[] = [
    watch(
      'window.defaultAvatar',
      formatClobber(chrome),
      chrome.kind === 'undefined'
        ? 'Nothing with id=defaultAvatar is in #user-comments yet, so the lookup is undefined (falsy).'
        : chrome.kind === 'collection'
          ? 'Duplicate ids. Chromium exposes an HTMLCollection, not a single node.'
          : 'One matching id. Chromium exposes the element. Nodes are truthy, so the || fallback will not run.',
      prev,
    ),
    watch(
      'window.defaultAvatar.avatar',
      formatMaybeString(chromeAvatar),
      chrome.kind === 'collection'
        ? chromeAvatar !== undefined
          ? 'Named getter on the collection: a lone <a name=avatar> yields its href string, not the element.'
          : 'The collection has no named item avatar, so this property is undefined.'
        : 'This named href trick needs an HTMLCollection. A single element does not expose .avatar as that href.',
      prev,
    ),
  ];
  if (defaultAvatar) {
    watches.push(
      watch(
        'defaultAvatar',
        formatClobber(defaultAvatar),
        defaultAvatar.kind === 'fallback'
          ? 'The || fallback ran because window.defaultAvatar was falsy.'
          : 'The || fallback did not run. defaultAvatar is the clobbered window value.',
        prev,
      ),
    );
  }
  if (avatarSrc !== null) {
    watches.push(
      watch(
        'avatarSrc',
        formatMaybeString(avatarSrc),
        comment?.avatar
          ? 'Taken from comment.avatar after escapeHTML.'
          : 'comment.avatar is empty, so this is defaultAvatar.avatar.',
        prev,
      ),
    );
  }
  if (comment) {
    const sanitized = sanitizeCommentHtml(comment.body);
    watches.push(
      watch(
        'comment.body',
        formatMaybeString(comment.body),
        'HTML stored in this JSON entry. Apply a preset or the editor to change it.',
        prev,
      ),
    );
    watches.push(
      watch(
        'DOMPurify.sanitize(comment.body)',
        formatMaybeString(sanitized),
        sanitized === comment.body
          ? 'The sanitizer kept this markup.'
          : sanitized
            ? 'After DOMPurify: script tags and event handlers are gone. javascript: and data: hrefs are removed. Relative hrefs such as favicon.ico stay. cid: keeps a literal ".'
            : 'The sanitizer dropped this markup.',
        prev,
      ),
    );
  }
  return watches;
}

function firefoxNote(lookup: NamedLookup | null): string {
  if (!lookup) return '';
  const { chrome, firefox, chromeAvatar, firefoxAvatar } = lookup;
  if (chrome.kind === 'collection' && firefox.kind === 'element') {
    return `Firefox keeps the first id=defaultAvatar element instead of an HTMLCollection, so .avatar is ${formatMaybeString(firefoxAvatar)} rather than ${formatMaybeString(chromeAvatar)}.`;
  }
  if (chrome.kind === firefox.kind) {
    return '';
  }
  return `Firefox: ${formatClobber(firefox)}. Chromium: ${formatClobber(chrome)}.`;
}

function pageSnap(
  state: LoopState | null,
  opts: ViewOpts = {},
): { dom: DomView | null; pendingDom: DomView | null; pageHtml: string } {
  if (!state) {
    return { dom: null, pendingDom: null, pageHtml: '' };
  }
  return {
    dom: viewPage(state.simDoc.documentElement, opts, state.pending),
    pendingDom: state.pending
      ? viewPage(state.pending, { highlightPending: true }, state.pending)
      : null,
    pageHtml: serializeSimPage(state.simDoc),
  };
}

export function buildDomClobberingSteps(input: ScenarioInput): ScenarioStep[] {
  const comments = commentsFor(input);
  const commentsJson = jsonOf(comments);
  const payloadIndex = input.carlos ? 1 : 0;
  const getPost = httpGet('/post?postId=1');
  const getHeader = httpGet('/resources/labheader/js/labHeader.js');
  const getPurify = httpGet('/resources/js/domPurify-2.0.15.js');
  const getLoader = httpGet('/resources/js/loadCommentsWithDomClobbering.js');
  const getComments = httpGet('/post/comment?postId=1');
  const getCommentsRes = httpOk('application/json', commentsJson);
  const postHtml = httpOk('text/html; charset=utf-8', APPROX_POST_HTML);
  let state: LoopState | null = null;
  const steps: ScenarioStep[] = [];
  let prevWatches: Watch[] | undefined;
  let bindingsVisible = false;
  let lastPass: CommentPass | null = null;

  const push = (
    partial: Omit<
      ScenarioStep,
      'highlightScripts' | 'pendingDom' | 'dom' | 'pageHtml' | 'pageNote' | 'pageMark'
    > & {
      highlightScripts?: boolean;
      viewOpts?: ViewOpts;
      includeDom?: boolean;
      pageNote?: string;
      pageMark?: string;
    },
  ): void => {
    const { viewOpts, includeDom, pageNote, pageMark, ...rest } = partial;
    const showDom = includeDom ?? Boolean(state);
    const snap = showDom
      ? pageSnap(state, {
          highlightScripts: rest.highlightScripts ?? false,
          ...viewOpts,
        })
      : { dom: null, pendingDom: null, pageHtml: '' };
    const step: ScenarioStep = {
      ...rest,
      highlightScripts: rest.highlightScripts ?? false,
      dom: snap.dom,
      pendingDom: snap.pendingDom,
      pageHtml: snap.pageHtml,
      pageNote: pageNote ?? '',
      pageMark: pageMark ?? '',
    };
    steps.push(step);
    if (step.watches.length > 0) prevWatches = step.watches;
  };

  const watchesNow = (
    lookup: NamedLookup | null,
    defaultAvatar: ClobberValue | null,
    avatarSrc: string | null,
    comment: LabComment | null,
  ): Watch[] => (bindingsVisible ? baseWatches(lookup, defaultAvatar, avatarSrc, comment, prevWatches) : []);

  push({
    id: 'intro',
    title: 'How this walkthrough works',
    narration:
      'The comments are already stored. This walkthrough starts after those POSTs, when the victim reloads the blog post. Chromium named properties are modeled here; this tab\'s window is not used, so Firefox still sees the HTMLCollection the lab needs. Next walks that reload: the post HTML, the scripts the parser finds, loadComments until xhr.send, the stored comments JSON, then displayComments line by line. The innerHTML sink is parsed as text. Event handlers are not executed. Payload presets at the bottom change the stored comments JSON, not a new POST.',
    pane: 'http',
    jsLines: [],
    watches: [],
    firefoxNote: '',
    sink: null,
    request: '',
    response: '',
    loopLabel: '',
    includeDom: false,
  });

  push({
    id: 'get-post',
    title: 'Browser emits GET /post',
    narration:
      'The tab navigates to /post?postId=1. This request is on the wire. Nothing has come back yet, so there is no document and no comments JSON.',
    pane: 'http',
    jsLines: [],
    watches: [],
    firefoxNote: '',
    sink: null,
    request: getPost,
    response: '',
    loopLabel: '',
    includeDom: false,
  });

  push({
    id: 'get-post-response',
    title: 'The post HTML arrives',
    narration:
      'The response is a shell: the article, an empty comments slot, and some script tags. Comments are not in this HTML. The parser has not run yet.',
    pane: 'http',
    jsLines: [],
    watches: [],
    firefoxNote: '',
    sink: null,
    request: '',
    response: postHtml,
    loopLabel: '',
    includeDom: false,
  });

  state = createSimDom(APPROX_POST_HTML);
  const page = state;

  push({
    id: 'parse-html',
    title: 'HTML parser builds the page',
    narration:
      'The browser turns that response into a document. The tree is the live page. #user-comments is a span with no comment sections yet.',
    pane: 'http',
    jsLines: [],
    watches: [],
    firefoxNote: '',
    sink: null,
    request: '',
    response: '',
    loopLabel: '',
    pageNote:
      'The highlighted node is #user-comments, the empty slot that will receive comment sections later.',
    pageMark: 'user-comments',
  });

  push({
    id: 'find-scripts',
    title: 'Parser finds script tags',
    narration:
      'Walking the tree, the parser queues every script. labHeader.js is lab chrome. Then come DOMPurify 2.0.15, loadCommentsWithDomClobbering.js, and an inline call loadComments("/post/comment"). External src scripts are fetched before that inline call runs.',
    pane: 'http',
    jsLines: [],
    watches: [],
    firefoxNote: '',
    sink: null,
    request: '',
    response: '',
    loopLabel: '',
    highlightScripts: true,
    pageNote:
      'Highlighted nodes are the <script> tags the parser queued. The browser fetches each src, then runs the inline call.',
    pageMark: '<script',
  });

  push({
    id: 'get-labheader',
    title: 'Browser requests labHeader.js',
    narration:
      'The first script in the body is lab chrome. The parser still has two more src scripts, then the inline call.',
    pane: 'http',
    jsLines: [],
    watches: [],
    firefoxNote: '',
    sink: null,
    request: getHeader,
    response: '',
    loopLabel: '',
    viewOpts: { highlightScriptSrc: '/resources/labheader/js/labHeader.js' },
    pageNote: 'The highlighted script is labHeader.js, the file this GET is fetching. It is lab chrome, not the comments bug.',
    pageMark: 'labHeader.js',
  });

  push({
    id: 'get-labheader-response',
    title: 'labHeader.js arrives',
    narration:
      'The file runs. It draws the academy banner. It does not load comments.',
    pane: 'http',
    jsLines: [],
    watches: [],
    firefoxNote: '',
    sink: null,
    request: '',
    response: httpOk(
      'application/javascript',
      '/* labHeader.js */\n/* academy lab banner; not part of the comments bug */\n',
    ),
    loopLabel: '',
    viewOpts: { highlightScriptSrc: '/resources/labheader/js/labHeader.js' },
    pageNote: 'The highlighted script is labHeader.js, the file this GET is fetching. It is lab chrome, not the comments bug.',
    pageMark: 'labHeader.js',
  });

  push({
    id: 'get-dompurify',
    title: 'Browser requests DOMPurify',
    narration:
      'The first comments-related script is the sanitizer. It has not run yet.',
    pane: 'http',
    jsLines: [],
    watches: [],
    firefoxNote: '',
    sink: null,
    request: getPurify,
    response: '',
    loopLabel: '',
    viewOpts: { highlightScriptSrc: '/resources/js/domPurify-2.0.15.js' },
    pageNote: 'The highlighted script is DOMPurify 2.0.15, the sanitizer that will run on comment bodies.',
    pageMark: 'domPurify-2.0.15.js',
  });

  push({
    id: 'get-dompurify-response',
    title: 'DOMPurify arrives',
    narration:
      'After this file runs, DOMPurify.sanitize exists. It will later strip dangerous markup from comment bodies while still allowing <a id> and <a name href>.',
    pane: 'http',
    jsLines: [],
    watches: [],
    firefoxNote: '',
    sink: null,
    request: '',
    response: httpOk(
      'application/javascript',
      '/* DOMPurify 2.0.15 */\nfunction DOMPurify() {\n  /* sanitizer loaded */\n}\n',
    ),
    loopLabel: '',
    viewOpts: { highlightScriptSrc: '/resources/js/domPurify-2.0.15.js' },
    pageNote: 'The highlighted script is DOMPurify 2.0.15, the sanitizer that will run on comment bodies.',
    pageMark: 'domPurify-2.0.15.js',
  });

  push({
    id: 'get-loader',
    title: 'Browser requests loadCommentsWithDomClobbering.js',
    narration:
      'The loader file defines loadComments and displayComments. It is still on the wire.',
    pane: 'http',
    jsLines: [],
    watches: [],
    firefoxNote: '',
    sink: null,
    request: getLoader,
    response: '',
    loopLabel: '',
    viewOpts: { highlightScriptSrc: '/resources/js/loadCommentsWithDomClobbering.js' },
    pageNote:
      'The highlighted script is loadCommentsWithDomClobbering.js. That is the file this GET loads. It defines loadComments and displayComments.',
    pageMark: 'loadCommentsWithDomClobbering.js',
  });

  push({
    id: 'get-loader-response',
    title: 'loadCommentsWithDomClobbering.js arrives',
    narration:
      'This is the real comments loader. Evaluating it defines loadComments, nested escapeHTML, and nested displayComments. Nothing has fetched comments yet. The next script tag has no src.',
    pane: 'http',
    jsLines: [],
    watches: [],
    firefoxNote: '',
    sink: null,
    request: '',
    response: httpOk('application/javascript', originalLoaderJs.trimEnd()),
    loopLabel: '',
    viewOpts: { highlightScriptSrc: '/resources/js/loadCommentsWithDomClobbering.js' },
    pageNote:
      'The highlighted script is loadCommentsWithDomClobbering.js. That is the file this GET loaded.',
    pageMark: 'loadCommentsWithDomClobbering.js',
  });

  push({
    id: 'inline-call',
    title: 'Inline script calls loadComments',
    narration:
      'External src scripts have already run. The last script inside #user-comments has no src, so the engine runs loadComments("/post/comment"). That string is postCommentPath.',
    pane: 'http',
    jsLines: [],
    watches: [],
    firefoxNote: '',
    sink: null,
    request: '',
    response: '',
    loopLabel: '',
    viewOpts: { highlightInline: true },
    pageNote:
      'The highlighted script has no src. This call is what starts the comments XHR.',
    pageMark: "loadComments('/post/comment')",
  });

  push({
    id: 'xhr-create',
    title: 'loadComments constructs XMLHttpRequest',
    narration:
      'Execution is now inside loadComments. A new XHR object exists. No URL has been chosen and nothing is on the wire.',
    pane: 'script',
    jsLines: [JS.loadFn, JS.xhrCreate],
    watches: [],
    firefoxNote: '',
    sink: null,
    request: '',
    response: '',
    loopLabel: '',
    includeDom: false,
  });

  push({
    id: 'xhr-handler',
    title: 'onreadystatechange is registered, not run',
    narration:
      'This function is stored on the XHR. It does not run yet. Later, when readyState is 4 and status is 200, it will JSON.parse the body and call displayComments.',
    pane: 'script',
    jsLines: [JS.xhrReady, JS.xhrIf, JS.xhrParse, JS.xhrDisplay],
    watches: [],
    firefoxNote: '',
    sink: null,
    request: '',
    response: '',
    loopLabel: '',
    includeDom: false,
  });

  push({
    id: 'xhr-open',
    title: 'xhr.open builds GET /post/comment?postId=1',
    narration:
      'open concatenates postCommentPath with window.location.search. The page is /post?postId=1, so the URL is /post/comment?postId=1. send has not run, so the request is still local.',
    pane: 'script',
    jsLines: [JS.xhrOpen],
    watches: [],
    firefoxNote: '',
    sink: null,
    request: '',
    response: '',
    loopLabel: '',
    includeDom: false,
  });

  push({
    id: 'xhr-send',
    title: 'xhr.send puts the request on the wire',
    narration:
      'send() is the AJAX dispatch. The browser now emits GET /post/comment?postId=1. displayComments still has not run.',
    pane: 'script',
    jsLines: [JS.xhrSend],
    watches: [],
    firefoxNote: '',
    sink: null,
    request: '',
    response: '',
    loopLabel: '',
    includeDom: false,
  });

  push({
    id: 'get-comments',
    title: 'Browser requests /post/comment',
    narration:
      'This is the XHR from xhr.send. The query string is the same postId the blog page used.',
    pane: 'http',
    jsLines: [],
    watches: [],
    firefoxNote: '',
    sink: null,
    request: getComments,
    response: '',
    loopLabel: '',
    includeDom: false,
  });

  push({
    id: 'fetch-json',
    title: 'The comments JSON arrives',
    narration:
      'readyState becomes 4 and status is 200. The body is a JSON array. Stored HTML, including the payload, is still just strings. The onreadystatechange handler can run now.',
    pane: 'http',
    jsLines: [],
    watches: [],
    firefoxNote: '',
    sink: null,
    request: '',
    response: getCommentsRes,
    loopLabel: '',
    includeDom: false,
  });

  push({
    id: 'xhr-parse',
    title: 'JSON.parse, then displayComments',
    narration:
      'The handler that was registered before send now runs. JSON.parse turns this.responseText into an array. displayComments(comments) is called with that array.',
    pane: 'script',
    jsLines: [JS.xhrIf, JS.xhrParse, JS.xhrDisplay],
    watches: [],
    firefoxNote: '',
    sink: null,
    request: '',
    response: '',
    loopLabel: '',
    includeDom: false,
  });

  push({
    id: 'get-user-comments',
    title: 'Look up #user-comments',
    narration:
      'displayComments starts by reading the live node that will receive every comment section. The script tags that already ran are still children of that span.',
    pane: 'script',
    jsLines: [JS.getEl],
    watches: [],
    firefoxNote: '',
    sink: null,
    request: '',
    response: '',
    loopLabel: '',
    includeDom: false,
  });

  comments.forEach((comment, index) => {
    const isPayload = index === payloadIndex;
    const isTrigger = input.trigger && index === payloadIndex + 1;
    const label = `Comment ${index + 1} of ${comments.length} (${comment.name})`;
    const pass = beginCommentPass(page, comment);
    const { lookup, defaultAvatar, avatarSrc, sink } = pass;

    push({
      id: `comment-${index}-loop`,
      title: `${label}: enter the loop`,
      narration: isPayload
        ? 'This JSON entry is the stored payload. The anchors are still a string in comment.body. They are not in the document yet.'
        : isTrigger
          ? 'This is a later comment. If the payload already landed in the document, window.defaultAvatar may now be clobbered.'
          : 'An earlier comment with no id=defaultAvatar. This iteration should use the fallback avatar path.',
      pane: 'script',
      jsLines: [JS.loop, JS.commentVar],
      watches: bindingsVisible ? watchesNow(lookup, null, null, comment) : [
        watch(
          'comment.body',
          formatMaybeString(comment.body),
          'HTML stored in this JSON entry.',
          prevWatches,
        ),
      ],
      firefoxNote: bindingsVisible ? firefoxNote(lookup) : '',
      sink: null,
      request: '',
      response: '',
      loopLabel: label,
    });

    startCommentSection(page);
    push({
      id: `comment-${index}-section`,
      title: `${label}: createElement("section")`,
      narration:
        'A new section.comment exists only in memory. It is not a child of #user-comments yet, so ids inside it cannot clobber window.',
      pane: 'script',
      jsLines: [JS.section],
      watches: bindingsVisible ? watchesNow(lookup, null, null, comment) : [
        watch(
          'comment.body',
          formatMaybeString(comment.body),
          'HTML stored in this JSON entry.',
          prevWatches,
        ),
      ],
      firefoxNote: '',
      sink: null,
      request: '',
      response: '',
      loopLabel: label,
    });

    bindingsVisible = true;
    push({
      id: `comment-${index}-lookup`,
      title: `${label}: window.defaultAvatar || fallback`,
      narration: isTruthyClobber(lookup.chrome)
        ? 'The lookup is truthy. The || fallback object is skipped. defaultAvatar is whatever Chromium reflected onto window.'
        : 'window.defaultAvatar is undefined, so the script uses the hardcoded SVG path object.',
      pane: 'script',
      jsLines: [JS.lookup],
      watches: watchesNow(lookup, defaultAvatar, null, comment),
      firefoxNote: firefoxNote(lookup),
      sink: null,
      request: '',
      response: '',
      loopLabel: label,
    });

    push({
      id: `comment-${index}-src`,
      title: `${label}: build avatarImgHTML`,
      narration: comment.avatar
        ? 'comment.avatar is set, so escapeHTML(comment.avatar) is concatenated into the img src.'
        : avatarSrc.includes('"')
          ? 'comment.avatar is empty, so the src is defaultAvatar.avatar. That string still contains a literal ".'
          : 'comment.avatar is empty, so the src is defaultAvatar.avatar.',
      pane: 'script',
      jsLines: [JS.avatarHtml],
      watches: watchesNow(lookup, defaultAvatar, avatarSrc, comment),
      firefoxNote: firefoxNote(lookup),
      sink: null,
      request: '',
      response: '',
      loopLabel: label,
    });

    addAvatarToSection(page, pass, Boolean(isTrigger && sink.wouldExecute));
    push({
      id: `comment-${index}-sink`,
      title: `${label}: innerHTML builds the img`,
      narration: sink.wouldExecute
        ? `The string is ${sink.raw}. The parser ends src at the first ", so onerror becomes its own attribute. This model does not run it.`
        : `The string is ${sink.raw}. The img is attached to the in-memory section, not yet to #user-comments.`,
      pane: 'script',
      jsLines: [JS.div, JS.sink],
      watches: watchesNow(lookup, defaultAvatar, avatarSrc, comment),
      firefoxNote: firefoxNote(lookup),
      sink,
      request: '',
      response: '',
      loopLabel: label,
    });

    addBodyToSection(page, pass);
    push({
      id: `comment-${index}-sanitize`,
      title: `${label}: DOMPurify.sanitize(comment.body)`,
      narration: isPayload
        ? pass.sanitizedBody === comment.body
          ? 'The sanitizer kept the <a> tags. They sit on the in-memory section. Chromium has not reflected them onto window yet.'
          : pass.sanitizedBody
            ? `After DOMPurify the body is ${pass.sanitizedBody}. Script tags, event handlers, and javascript: hrefs are gone. Remaining anchors can still clobber window after append.`
            : 'The sanitizer dropped this comment body. Nothing from it will clobber window.'
        : pass.sanitizedBody
          ? 'Sanitized markup is placed in a <p> on the in-memory section.'
          : 'This comment body was empty after sanitizing, so no extra markup is added.',
      pane: 'script',
      jsLines: [JS.sanitize, JS.appendBody],
      watches: watchesNow(lookup, defaultAvatar, avatarSrc, comment),
      firefoxNote: '',
      sink,
      request: '',
      response: '',
      loopLabel: label,
    });

    commitCommentSection(page);
    const after = beginCommentPass(page, comment);
    lastPass = pass;
    push({
      id: `comment-${index}-append`,
      title: `${label}: appendChild into #user-comments`,
      narration: after.lookup.chrome.kind === 'collection'
        ? 'The section is live. Chromium sees two elements with id=defaultAvatar and builds an HTMLCollection. The named getter .avatar is the second anchor href.'
        : after.lookup.chrome.kind === 'element'
          ? 'The section is live. One matching id is now window.defaultAvatar. That node is truthy, but .avatar is not the href string.'
          : isTrigger && sink.wouldExecute
            ? 'The img with the split attributes is in the page. The sink already fired at innerHTML, not at this append.'
            : 'The comment section is now a child of #user-comments. No id=defaultAvatar was added.',
      pane: 'script',
      jsLines: [JS.append],
      watches: watchesNow(after.lookup, after.lookup.chrome, avatarSrc, comment),
      firefoxNote: firefoxNote(after.lookup),
      sink,
      request: '',
      response: '',
      loopLabel: label,
    });
  });

  push({
    id: 'summary',
    title: 'What happened',
    narration: summarizeWalkthrough(input, lastPass),
    pane: 'summary',
    jsLines: [],
    watches: [],
    firefoxNote: '',
    sink: null,
    request: '',
    response: '',
    loopLabel: '',
    includeDom: false,
  });

  return steps;
}

function summarizeWalkthrough(input: ScenarioInput, lastPass: CommentPass | null): string {
  const parts = [
    'Those comments were already on the server. Reloading the post fetched them as JSON and displayComments built the page.',
  ];
  if (!input.trigger) {
    parts.push(
      'There was no later comment, so nothing read window.defaultAvatar after the payload landed in #user-comments.',
    );
    return parts.join(' ');
  }
  if (!lastPass) return parts.join(' ');
  const src = lastPass.avatarSrc;
  if (lastPass.sink.wouldExecute) {
    parts.push(
      `On the last comment, defaultAvatar.avatar was ${JSON.stringify(src)}. The img parser split an onerror handler. In Chromium that handler would run. This page does not execute it.`,
    );
  } else if (src === 'undefined') {
    parts.push(
      'On the last comment, defaultAvatar.avatar was undefined. The sanitizer likely removed a javascript: or data: href, or no name=avatar href remained, so the img src became the string "undefined".',
    );
  } else if (src === '' ) {
    parts.push(
      'On the last comment, defaultAvatar.avatar was an empty string. The named getter found name=avatar, but DOMPurify had stripped the href.',
    );
  } else if (src === FALLBACK_AVATAR) {
    parts.push(
      `On the last comment, window.defaultAvatar was still falsy, so the img src was the fallback ${JSON.stringify(src)}.`,
    );
  } else {
    parts.push(
      `On the last comment, defaultAvatar.avatar was ${JSON.stringify(src)}, so the img src used that href. No event handler was present, so the sink did not execute.`,
    );
  }
  return parts.join(' ');
}

export { LAB_PAYLOAD };
