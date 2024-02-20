let hamburger = document.getElementById('hamburger-icon')
let navbar = document.getElementById('my-nav')

hamburger.onclick = () => {
    navbar.classList.toggle('open')
}