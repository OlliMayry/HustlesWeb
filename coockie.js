const cookieBanner = document.querySelector('.cookie-banner');
const acceptButton = document.querySelector('#accept-cookies');

acceptButton.addEventListener('click', () => {
  // Set a cookie to record the user's consent
  document.cookie = 'cookies-accepted=true; domain=hustles.netlify.app; expires=Fri, 31 Dec 9999 23:59:59 GMT';
  
  // Hide the cookie banner
  cookieBanner.style.display = 'none';
});

// Check if the user has already consented to cookies
if (document.cookie.includes('cookies-accepted=true')) {
  cookieBanner.style.display = 'none';
} else {
  cookieBanner.style.display = 'flex';
}