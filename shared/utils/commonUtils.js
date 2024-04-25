const fallbackCopyTextToClipboard = (text) => {
  var textArea = document.createElement("textarea");
  textArea.value = text;
  
  // Avoid scrolling to bottom
  textArea.style.top = "0";
  textArea.style.left = "0";
  textArea.style.position = "fixed";

  document.body.appendChild(textArea);
  textArea.focus();
  textArea.select();

  try {
    var successful = document.execCommand('copy');
    var msg = successful ? 'successful' : 'unsuccessful';
    console.log('Fallback: Copying text command was ' + msg);
  } catch (err) {
    alert('Có lỗi xãy ra khi copy text, liên hệ admin');
  }

  document.body.removeChild(textArea);
}

export const copyTextToClipboard = (text) => {
  if (!navigator.clipboard) {
    fallbackCopyTextToClipboard(text);
    return;
  }
  navigator.clipboard.writeText(text).then(function() {
    console.log('Async: Copying to clipboard was successful!');
  }, function(err) {
    alert('Có lỗi xãy ra khi copy text, liên hệ admin');
  });
}

export const objectCompare = (obj1, obj2) => {
  if (typeof obj1 != "object" || typeof obj2 != "object") return obj2 == obj2;
  return JSON.stringify(obj1) == JSON.stringify(obj2);
}