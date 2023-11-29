 function copyToClipboard (text: string) {
  navigator.clipboard.writeText(text).then(
    function () {
      console.log(`Copied ${text} to clipboard`);
    },
    function (err) {
      console.error("Copy text to clipboard error: ", err);
    }
  );
}

export default copyToClipboard;
