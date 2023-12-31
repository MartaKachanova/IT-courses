// Для этого пишем функцию getMoney, которая:

// в качестве входящих аргументов принимает объекты userData и bankData.
// возвращает Promise, в котором условием перехода в первый .then является ответ юзера на вопрос 'Посмотреть баланс на карте?’.
// Если юзер выбирает Да (Yes, Подтвердить), то вызываем функцию resolve(userData)
// В функции resolve, в зависимости от доступных пользователю валют (userData), предлагаем пользователю ввести валюту, по которой будет выведен баланс.
// Если пользователь вводить в prompt название НЕдопустимой для него валюты, продолжаем запрашивать валюту, пока не будет введена допустимая.
// При вводе пользователем названия допустимой ему валюты – выводим данные о балансе по данной валюте в консоль, например: ‘Баланс составляет: 1000 USD’.
// Если юзер выбирает Отмена (No), то взываем функцию reject({userData: userData, bankData: bankData})
// В функции reject, в зависимости от доступных пользователю валют (userData) и доступных валют в текущем банкомате bankData (с НЕ нулевым значением свойства max, что говорит об отсутствии в данный момент купюр этой валюты в банкомате), предлагаем пользователю ввести валюту, по которой будет произведено снятие наличных и сумму снятия.
// Если пользователь вводить в prompt название НЕдопустимой для него и для банкомата валюты, продолжаем запрашивать валюту, пока не будет введена допустимая.
// Если пользователь вводить в prompt сумму превышающую max для данной валюты, или сумму превышающую его личные средства по данной валюте, то выводим в консоль сообщение: `Введенная сумма больше допустимой. Максимальная сумма снятия: …`
// Если пользователь вводить в prompt сумму меньше min для данной валюты, выводим в консоль сообщение: `Введенная сумма меньше допустимой. Минимальная сумма снятия: …`
// При вводе пользователем допустимой ему и текущему банкомату название валюты и сумму – выводим сообщение об успешном снятии наличных в консоль, например: ‘Вот Ваши денежки 200 USD 💵’.
// Финальное сообщение, которое вне зависимости от выбора операции должен получить юзер в консоли – 'Спасибо, хорошего дня 😊'

let userData = {
  USD: 1000,
  EUR: 900,
  UAH: 15000,
  BIF: 20000,
  AOA: 100,
};
const bankData = {
  USD: {
    max: 3000,
    min: 100,
    img: "💵",
  },
  EUR: {
    max: 1000,
    min: 50,
    img: "💶",
  },
  UAH: {
    max: 0,
    min: 0,
    img: "💴",
  },
  GBP: {
    max: 10000,
    min: 100,
    img: "💷",
  },
};

function getMoney(userData, bankData) {
  return new Promise(function (resolve, reject) {
    const result = confirm("Посмотреть баланс на карте?")
      ? resolve(userData)
      : reject({ userData: userData, bankData: bankData });
  });
}

const promise = getMoney({ userData, bankData });
let currency;
const userMoney = Object.keys(userData);

promise.then(
  () => {
    do {
      currency = prompt(
        `Введите название валюты в формате: ${userMoney.join(", ")}`,
        userMoney[0]
      ).toUpperCase();
    } while (!userMoney.find((value) => value === currency));

    console.log(`Баланс составляет ${userData[currency]} ${currency}`);
  },

  promise.catch(() => {
    const userMoney = [
      ...Object.keys(userData)?.filter(
        (item) => bankData[item] && bankData[item.max > 0]
      ),
    ];
    do {
      const userMoney = Object.keys(userData);
      currency = prompt(
        `Введите название валюты в формате: ${userMoney.join(", ")}`,
        userMoney[0]
      ).toUpperCase();

      takeoutMoney(userData[currency], bankData[currency], currency);
      break;
    } while (!userMoney.find((value) => value === currency));
  })
);

promise.finally(() => {
  console.log("Спасибо, хорошего дня 😊");
});

function takeoutMoney(balance, info = {}, currency) {
  const sum = prompt("Введите суму");

  sum > balance || sum > info.max
    ? console.log(
        `Введенная сумма больше допустимой. Максимальная сумма снятия: ${balance} ${currency}`
      )
    : sum < info.min
    ? console.log(
        `Введенная сумма меньше допустимой. Минимальная сумма снятия: ${info.min} ${currency}`
      )
    : console.log(`Вот Ваши денежки ${sum} ${currency} ${info.img}`);
}
