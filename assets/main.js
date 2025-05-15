
const version = "v0.0.4";
const versionElements = document.querySelectorAll(".version-number");

for (const el of versionElements) {
  el.textContent = version;
}

document.querySelectorAll('#menu-nav .nav-link').forEach(link => {
    link.addEventListener('click', function () {
      document.querySelectorAll('#menu-nav .nav-link').forEach(item => {
        item.classList.remove('active');
      });
      this.classList.add('active');
    });
  });
