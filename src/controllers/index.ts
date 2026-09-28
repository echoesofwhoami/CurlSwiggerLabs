import { Application } from '@hotwired/stimulus'
import CopyCodeController from './copy_code_controller'
import HttpToggleController from './http_toggle_controller'
import NavbarController from './navbar_controller'
import QuizController from './quiz_controller'
import RequestDiffController from './request_diff_controller'
import ThemeTweakerController from './theme_tweaker_controller'
import TooltipController from './tooltip_controller'

const application = Application.start()

application.register('navbar', NavbarController)

application.register('http-toggle', HttpToggleController)

application.register('request-diff', RequestDiffController)

application.register('copy-code', CopyCodeController)

application.register('tooltip', TooltipController)

application.register('quiz', QuizController)

application.register('theme-tweaker', ThemeTweakerController)
