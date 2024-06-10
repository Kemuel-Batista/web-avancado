const images = [
  {
    title: 'ferrari-156',
    url: './ferrari-156.webp'
  },
  {
    title: 'ferrari-250-gto',
    url: './ferrari-250-gto.webp'
  },
  {
    title: 'ferrari-250',
    url: './ferrari-250.webp'
  },
  {
    title: 'ferrari-312',
    url: './ferrari-312.webp'
  },
  {
    title: 'ferrari-f2004',
    url: './ferrari-f2004.webp'
  },
]

document.addEventListener('DOMContentLoaded', function() {
  const track = document.getElementById('track');
  const balanceDisplay = document.getElementById('balance');
  const betAmountInput = document.getElementById('bet-amount');
  const driverSelect = document.getElementById('driver-select');
  const placeBetButton = document.getElementById('place-bet');

  let cars = [];
  let intervalId;
  let balance = 100;
  let betPlaced = false;
  const maxCars = 5;

  if (cars.length === 0) {
    for (let i = 0; i < maxCars; i++) {
      cars.push(createCar(i));
    }
  }

  function createCar(i) {
    const car = document.createElement('div');
    car.className = 'car';
    car.style.padding = '5px';

    const image = document.createElement('img');
    image.src = images[i].url;
    image.alt = images[i].title;
    image.style.width = '60px';
    image.style.height = '40px';

    car.appendChild(image);

    track.appendChild(car);
    return car;
  }

  function moveCars() {
    intervalId = setInterval(() => {
      cars.forEach(car => {
        const moveAmount = Math.random() * 10;
        car.style.marginLeft = (parseFloat(car.style.marginLeft) || 0) + moveAmount + 'px';
      });
      checkWinner();
    }, 50);
  }

  function checkWinner() {
    const winningCar = cars.find(car => parseFloat(car.style.marginLeft) >= 750);
    if (winningCar) {
      clearInterval(intervalId);
      const winningDriver = cars.indexOf(winningCar) + 1;
      const selectedDriver = parseInt(driverSelect.value);
      if (winningDriver === selectedDriver) {
        balance += parseInt(betAmountInput.value);
        balance += parseInt(betAmountInput.value);
        alert('Você ganhou! Seu novo saldo é R$' + balance);
      } else {
        alert('Você perdeu! Seu novo saldo é R$' + balance);
      }
      balanceDisplay.textContent = balance;
      resetCars();
      betPlaced = false;
      placeBetButton.disabled = false;
    }
  }

  function resetCars() {
    cars.forEach(car => {
      car.style.marginLeft = '0px';
    });
  }

  function handleSelectDriver() {
    const selectedDriver = parseInt(driverSelect.value);

    for (let i = 0; i < maxCars; i++) {
      cars[i].style.backgroundColor = 'red';
    } 

    if (selectedDriver) {
      cars[selectedDriver - 1].style.backgroundColor = 'green';
    }
  }

  driverSelect.addEventListener('change', function() {
    handleSelectDriver()
  })

  placeBetButton.addEventListener('click', function() {
    const betAmount = parseInt(betAmountInput.value);
    if (betPlaced) {
      alert('Aguarde o término da corrida para fazer uma nova aposta.');
      return;
    }

    if (balance >= betAmount) {
      balance -= betAmount;
      balanceDisplay.textContent = balance;
      betPlaced = true;
      placeBetButton.disabled = true;

      handleSelectDriver()

      moveCars();
    } else {
      alert('Saldo insuficiente!');
    }
  });
});