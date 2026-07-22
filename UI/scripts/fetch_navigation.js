fetch('inserted_html_files/navigation.html')
  .then(res => res.text())
  .then(data => {
    document.getElementById('nav_bar').innerHTML = data
  })
  .catch(err => console.error('nav load failed:', err))