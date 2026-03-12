### What is a Backup File (~)?

Many text editors (like Vim, Emacs, and others) automatically create backup copies of files by appending a tilde (`~`) to the filename. For example, editing `CustomTemplate.php` creates `CustomTemplate.php~`. These backup files often get accidentally deployed to production servers and can leak source code to anyone who requests them, depending on the configuration of the web server it may serve them as plain text.
