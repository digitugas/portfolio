$(document).ready(function()
{
    // navbar shrink
    $(window).on("scroll",function()
    {
        if($(this).scrollTop() > 90)
        {
            $(".navbar").addClass("navbar-shrink");
        }
        else
        {
            $(".navbar").removeClass("navbar-shrink");
        }
    })
    // parallax js
    function parallaxMouse()
    {
        if($('#parallax').length)
        {
            var scene = document.getElementById('parallax');
            var parallax = new Parallax(scene);
        }
    }
    parallaxMouse();
    // skills bar
    $(window).scroll(function()
    {
        var hT = $("#skill-bar-wrapper").offset().top,
        hH = $("#skill-bar-wrapper").outerHeight(),
        wH = $(window).height(),
        wS = $(this).scrollTop();
        if( wS > (hT+hH-1.4*wH))
        {
            jQuery('.skillbar-container').each(function()
            {
                jQuery(this).find('.skills').animate({
                    width:jQuery(this).attr('data-percent')
                }, 5000) // 5 seconds
            })
        }
    })
    // filter
    let $btns = $('.img-gallery .sortBtn .filter-btn');
    $btns.click(function(e) {
        $('.img-gallery .sortBtn .filter-btn').removeClass('active');
        e.target.classList.add('active');
        let selector = $(e.target).attr('data-filter');
        $('.img-gallery .grid').isotope
        ({
            filter:selector
        })
        return false;
    })
    $('.image-popup').magnificPopup
    ({
        type: 'image',
        gallery: { enabled: true}
    })
    // owl carousel
    $('.team-slider').owlCarousel({
        loop:true,
        margin:0,
        responsiveClass:true,
        autoplay:true,
        responsive:{
            0:{
                items:1,
            },
            600:{
                items:2,
            }
        }
    })
    // navbar collapse 
    $(".nav-link").on("click",function()
    {
        $(".navbar-collapse").collapse("hide");
    })
    // scroll
    $.scrollIt({
        topOffset:-50
    })
    
})




// Fungsi untuk menyimpan item baru ke localStorage
function saveToLocalStorage(data) {
  let items = JSON.parse(localStorage.getItem('portfolioItems')) || []; // Ambil data lama
  items.push(data); // Tambahkan item baru
  localStorage.setItem('portfolioItems', JSON.stringify(items)); // Simpan kembali
}

// Fungsi untuk menampilkan item portfolio ke dalam grid
function renderPortfolioItem(item, index) {
  const grid = document.querySelector('.grid'); // Elemen container portfolio
  const newItem = document.createElement("div");
  newItem.className = `col-lg-4 col-md-6 col-sm-6 ${item.category}`; // Tambahkan kategori untuk filter
  newItem.innerHTML = `
    <div class="single-work text-center mt-30 animate__animated animate__fadeIn">
      <div class="delete-icon">
        <a href="#" class="delete-btn" data-index="${index}" title="Hapus">
          <i class="fa fa-trash"></i>
        </a>
      </div>
      <div class="work-image">
        <img src="${item.image}" alt="${item.title}">
      </div>
      <div class="work-overlay">
        <div class="work-content">
          <h3 class="work-title">${item.title}</h3>
          <ul>
            <li><a href="${item.image}" class="image-popup"><i class="fa fa-plus"></i></a></li>
            ${item.link ? `<li><a href="${item.link}" target="_blank"><i class="fa fa-link"></i></a></li>` : ''}
          </ul>
        </div>
      </div>
    </div>
  `;
  grid.appendChild(newItem);
}

// Saat halaman dimuat, ambil semua item dari localStorage dan tampilkan
window.addEventListener('DOMContentLoaded', () => {
  const items = JSON.parse(localStorage.getItem('portfolioItems')) || [];
  items.forEach((item, index) => renderPortfolioItem(item, index));
});

// Event listener untuk menghapus item portfolio berdasarkan index
document.addEventListener('click', function(e) {
  if (e.target.closest('.delete-btn')) {
    const index = e.target.closest('.delete-btn').getAttribute('data-index');
    let items = JSON.parse(localStorage.getItem('portfolioItems')) || [];
    items.splice(index, 1); // Hapus item berdasarkan index
    localStorage.setItem('portfolioItems', JSON.stringify(items)); // Simpan ulang
    location.reload(); // Refresh halaman untuk update tampilan
  }
});

// Variabel untuk modal form
const modal = document.getElementById("formModal");
const openBtn = document.getElementById("addItemBtn");
const closeBtn = document.querySelector(".close");
const saveBtn = document.getElementById("saveItemBtn");

// Tampilkan modal saat tombol tambah ditekan
openBtn.onclick = () => modal.style.display = "block";
// Tutup modal saat tombol close ditekan
closeBtn.onclick = () => modal.style.display = "none";
// Tutup modal jika klik di luar modal
window.onclick = (e) => { if (e.target == modal) modal.style.display = "none"; };

// Fungsi untuk menyimpan item baru dari form input
document.getElementById("saveItemBtn").addEventListener("click", function(e) {
  e.preventDefault();

  // Ambil nilai dari form
  const title = document.getElementById("title").value;
  const projectLink = document.getElementById("projectLink").value;
  const category = document.getElementById("category").value;
  const fileInput = document.getElementById("fileInput");

  // Cek apakah ada file yang dipilih
  if (fileInput.files.length > 0) {
    const file = fileInput.files[0];
    const reader = new FileReader();

    reader.onload = function() {
      const base64Data = reader.result.split(",")[1]; // Ambil isi base64-nya

      // Kirim ke Google Apps Script untuk di-upload ke Google Drive
      fetch("https://script.google.com/macros/s/AKfycbxzhd1YZdBjU4gGWW35vmJAGM3rzCW4AhvlG-sPcl1rk40E7KUgAoNhN3eW3M6-mxP7jw/exec", {
        method: "POST",
        headers: {
          "Content-Type": file.type
        },
        body: base64Data
      })
      .then(res => res.text())
      .then(link => {
        // Menampilkan link gambar di form (dari Google Drive)
        console.log("File berhasil diupload, link:", link);

        // Simpan data portfolio di log (misalnya, bisa ditambahkan ke database atau storage)
        console.log({
          title,
          projectLink,
          category,
          imageLink: link // Link gambar yang sudah di-upload
        });

        // Reset form setelah berhasil
        document.getElementById("formModal").style.display = "none"; // Tutup modal
        fileInput.value = ""; // Reset input file
        document.getElementById("title").value = "";
        document.getElementById("projectLink").value = "";
        document.getElementById("category").value = "Website";

        alert("Portfolio berhasil ditambahkan!");
      })
      .catch(err => {
        console.error("Upload gagal:", err);
        alert("Upload gambar gagal. Coba lagi.");
      });
    };

    reader.readAsDataURL(file); // Membaca file sebagai base64
  } else {
    alert("Silakan pilih gambar terlebih dahulu.");
  }
});





    document.getElementById("addItemBtn").addEventListener("click", function () {
      // Scroll smooth ke section portfolio
      document.getElementById("portfolio").scrollIntoView({ behavior: "smooth" });
  
      // Tampilkan popup/modal setelah sedikit delay agar scroll sempat selesai
      setTimeout(function () {
        const myModal = new bootstrap.Modal(document.getElementById("addItemModal"));
        myModal.show();
      }, 1000); // delay 500ms
    });
  