window.boot = window.boot || {};
window.boot.config = window.boot.config || {};
window.boot.config.width = window.innerWidth; // 1200;
if (window.boot.config.width < 1000) {
  window.boot.config.width = 1000;
}
window.boot.config.height = window.innerHeight; //800;
if (window.boot.config.height < 800) {
  window.boot.config.height = 720;
}