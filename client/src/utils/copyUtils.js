// src/utils/copyUtils.js
export const copyToClipboard = (text) => {
  const textArea = document.createElement('textarea');
  textArea.value = text;
  document.body.appendChild(textArea);
  textArea.select();
  try {
    const successful = document.execCommand('copy');
    console.log(
      'Fallback: Copying text command was ' +
        (successful ? 'successful' : 'unsuccessful')
    );
  } catch (err) {
    console.error('Fallback: Oops, unable to copy', err);
  }
  document.body.removeChild(textArea);
};

export const copyWithFeedback = (text, setCopySuccess) => {
  copyToClipboard(text);
  setCopySuccess(true);
  setTimeout(() => {
    setCopySuccess(false);
  }, 2000);
};
