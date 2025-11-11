export const isWebShareSupported = () => {
  const ua = navigator.userAgent.toLowerCase();
  const isSafari = /safari/.test(ua) && !/chrome/.test(ua);
  const isChrome = /chrome|crios/.test(ua);
  const isEdge = /edg/.test(ua);
  const isFirefox = /firefox/.test(ua);

  return (
    navigator.share &&
    (isSafari || isChrome || isEdge) &&
    !isFirefox // Firefox exposes navigator.share but it's broken
  );
}