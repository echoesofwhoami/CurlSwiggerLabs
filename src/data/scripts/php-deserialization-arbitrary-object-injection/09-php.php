function __destruct() {
    // Carlos thought this would be a good idea
    if (file_exists($this->lock_file_path)) {
        unlink($this->lock_file_path);
    }
}
