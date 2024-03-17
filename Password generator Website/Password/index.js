const passwordBox=document.getElementById("password");
    const len=8;

    const num="23456789";
    const lowerCase="abcedfghijklmnopqrstuvwxyz";
    const symbol="$!&@#/%";
    const upperCase="ABCDEFGHIJKLMNOPQRSTUVWXYZ";

    const allchars=num+symbol;




function createPassword() {
    let password = "";
  
    password += num[Math.floor(Math.random() * num.length)];
    password += upperCase[Math.floor(Math.random() * upperCase.length)];
    password += symbol[Math.floor(Math.random() * symbol.length)];
    password += num[Math.floor(Math.random() * num.length)];
    password += lowerCase[Math.floor(Math.random() * lowerCase.length)];
   
    
  
    while (password.length < len) {
      password += allchars[Math.floor(Math.random() * allchars.length)];
    }


    passwordBox.value = password;
  
    const passwordCharacters = password.split('').map((char) => {
      if (char === '0') return '0';
      if (char === '1') return '1';
      if (char === '2') return '2';
      if (char === '3') return '3';
      if (char === '4') return '4';
      if (char === '5') return '5';
      if (char === '6') return '6';
      if (char === '7') return '7';
      if (char === '8') return '8';
      if (char === '9') return '9';
      if (lowerCase.includes(char)) return wordForChar(char);
      if (upperCase.includes(char)) return wordForChar(char);
      return char;
    });
    
    const sentence = passwordCharacters.join(' ');
    
    document.getElementById("sentence").textContent = sentence;
  
    
  }
  
  function wordForChar(char) {
    switch (char) {

    case 'A':
      return 'APPLES';
    case 'B':
      return 'BAllS';
    case 'C':
      return 'COFFEE';
    case 'D':
      return 'DINERS';
    case 'E':
      return 'EGG';
    case 'F':
      return 'FISH';
    case 'G':
      return 'GOLF';
    case 'H':
      return 'HOUSE';
    case 'I':
      return 'IPHONE';
    case 'J':
      return 'JUNGLE';
    case 'K':
      return 'KING';
    case 'L':
      return 'LAPTOP';
    case 'M':
      return 'MUSIC';
    case 'N':
      return 'NUT';
    case 'O':
      return 'OPPO';
    case 'P':
      return 'PARK';
    case 'Q':
      return 'QUEEN';
    case 'R':
      return 'ROPE';
    case 'S':
      return 'SKYPE';
    case 'T':
      return 'TREE';
    case 'U':
      return 'USER';
    case 'V':
      return 'VISA';
    case 'W':
      return 'WALL';
    case 'X':
      return 'XBOX';
    case 'Y':
      return 'YOUTUBE';
    case 'Z':
      return 'ZIP';
      case 'a':
      return 'apples';
    case 'b':
      return 'bikes';
    case 'c':
      return 'coffee';
    case 'd':
      return 'dish';
    case 'e':
      return 'eagle';
    case 'f':
      return 'fish';
    case 'g':
      return 'queen';
    case 'h':
      return 'horse';
    case 'i':
      return 'iphone';
    case 'j':
      return 'job';
    case 'k':
      return 'kite';
    case 'l':
      return 'laptop';
    case 'm':
      return 'music';
    case 'n':
      return 'new';
    case 'o':
      return 'omelet';
    case 'p':
      return 'python';
    case 'q':
      return 'quick';
    case 'r':
      return 'rope';
    case 's':
      return 'super';
    case 't':
      return 'tokyo';
    case 'u':
      return 'ufone';
    case 'v':
      return 'visa';
    case 'w':
      return 'water';
    case 'x':
      return 'xbox';
    case 'y':
      return 'yellow';
    case 'z':
      return 'zip';
      
      default:
        return char;
    }
  }
  

    function copy(){
        passwordBox.select();
        document.execCommand("copy");
  
    }
