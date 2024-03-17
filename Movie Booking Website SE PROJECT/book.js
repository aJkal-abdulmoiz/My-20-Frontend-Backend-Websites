// Function to retrieve users from local storage
function getUsersFromStorage() {
  const users = JSON.parse(localStorage.getItem('users')) || [];
  return users;
}

// Function to save users to local storage
function saveUsersToStorage(users) {
  localStorage.setItem('users', JSON.stringify(users));
}

// Function to check if a user exists
function checkUserExists(username, email) {
  const users = getUsersFromStorage();
  return users.some(user => user.username === username || user.email === email);
}

// Function to handle booking movie
function handleBookingMovie() {
  const bookButtons = document.querySelectorAll('.book-btn');

  bookButtons.forEach(button => {
    button.addEventListener('click', function(event) {
      const movieTitle = this.parentNode.querySelector('h4').textContent;
      const movieImgElement = this.closest('.movie-card').querySelector('.movie-img img');

      if (movieImgElement) {
        const movieImgSrc = movieImgElement.src;
        let usersData = getUsersFromStorage(); 

        let loggedInUser;
        for (const user of usersData) {
          if (user.isLoggedIn) {
            loggedInUser = user;
            break;
          }
        }

        if (!loggedInUser) {
          alert('Please log in first.');
          window.location.href = 'login.html'; 
          return; 
        }

        loggedInUser.bookings = loggedInUser.bookings || [];
        loggedInUser.bookings.push({ movie: movieTitle, image: movieImgSrc });

        saveUsersToStorage(usersData); 
        window.location.href = 'booking.html'; 
      } else {
        console.error('Movie image not found.');
      }
    });
  });
}

// Handle movie booking upon DOM content load
document.addEventListener('DOMContentLoaded', function() {
  handleBookingMovie();

  const users = getUsersFromStorage();
  const loggedInUser = users.find(user => user.isLoggedIn);

  if (loggedInUser) {
    displayBookings(loggedInUser);
  } else {
    console.log('No logged-in user found.');
    // Handle if no logged-in user is found
  }
});

// Function to display user bookings
function displayBookings(loggedInUser) {
  const userBookingsContainer = document.querySelector('.book-container');
  const bookings = loggedInUser.bookings || [];

  bookings.forEach(booking => {
    const bookingItem = createBookingItem(booking);
    userBookingsContainer.appendChild(bookingItem);
  });
}

// Function to create booking item
function createBookingItem(booking) {
  const bookingItem = document.createElement('div');
  bookingItem.classList.add('booking-item');
  bookingItem.classList.add('booking-layout');

  const movieImage = createMovieImage(booking);
  const bookingDetails = createBookingDetails(booking);

  bookingItem.appendChild(movieImage);
  bookingItem.appendChild(bookingDetails);

  return bookingItem;
}

// Function to create movie image element
function createMovieImage(booking) {
  const movieImage = document.createElement('img');
  movieImage.src = booking.image;
  movieImage.classList.add('booking-image');
  return movieImage;
}

// Function to create booking details
function createBookingDetails(booking) {
  const bookingDetails = document.createElement('div');
  bookingDetails.classList.add('booking-details');

  const movieTitle = document.createElement('h2');
  movieTitle.textContent = booking.movie;
  movieTitle.classList.add('booking-title');

  const printButton = createPrintButton(booking);

  bookingDetails.appendChild(movieTitle);
  bookingDetails.appendChild(printButton);

  return bookingDetails;
}

// Function to create print button
function createPrintButton(booking) {
  const printButton = document.createElement('button');
  printButton.textContent = 'Print';
  printButton.classList.add('print-button');
  printButton.addEventListener('click', function() {
    getBase64Image(booking.image, function(dataURL) {
      const docDefinition = createPdfDefinition(booking, dataURL);
      pdfMake.createPdf(docDefinition).download('booking_details.pdf');
    });
  });
  return printButton;
}

// Function to create PDF definition
function createPdfDefinition(booking, dataURL) {
  return {
    pageSize: 'A5',
    pageOrientation: 'landscape',
    content: [
      { text: `Movie: ${booking.movie}`, fontSize: 18, margin: [-10, 0, 0, 10] },
      { image: dataURL, width: 520, height: 200, margin: [-50, 0, 0, 10] }
    ]
  };
}

// Function to convert image to Data URL
function getBase64Image(url, callback) {
  const img = new Image();
  img.crossOrigin = 'Anonymous';
  img.onload = function() {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    canvas.width = this.width;
    canvas.height = this.height;
    ctx.drawImage(this, 0, 0);

    const dataURL = canvas.toDataURL('image/jpeg');
    callback(dataURL);
  };
  img.src = url;
}

// Event listener for sign-up form submission
document.getElementById("sign-up").addEventListener('click', function(event) {
  event.preventDefault();
  const username = document.querySelector('.sign-up-htm #signup-user').value;
  const password = document.querySelector('.sign-up-htm #signup-pass').value;
  const email = document.querySelector('.sign-up-htm #signup-email').value;

  signUpUser(username, password, email);
});

// Event listener for sign-in form submission
document.getElementById("sign-in").addEventListener('click', function(event) {
  event.preventDefault();
  const username = document.querySelector('.sign-in-htm #user').value;
  const password = document.querySelector('.sign-in-htm #pass').value;

  const user = authenticateUser(username, password);
  if (user) {
    alert('Login successful! Welcome, ' + user.username + '!');
    window.location.href = 'index.html';
  } else {
    alert('Invalid username or password.');
  }
});
