class President {
    static Pchance = 1;

    checkChance() {
        if (President.Pchance === 0) {
            showAlert("You have voted for the President already!!");
        }
    }
}

class Husnain extends President {
    constructor() {
        super();
        this.HusnainVotes = 0;
    }

    addHusnainVotes() {
        if (President.Pchance === 1) {
            this.HusnainVotes++;
            saveVotesData();
            console.log("Husnain Votes Increased to " + this.HusnainVotes);
            President.Pchance = 0; // Update the static variable

            var voteButton = document.querySelector('.box-1.Husnain .vote-btn');
            markAsVoted(voteButton);
        } else {
            showAlert("You have voted for the President already!!");
        }
    }
}

class M_Ali extends President {
    constructor() {
        super();
        this.M_AliVotes = 0;
    }

    addM_AliVotes() {
        if (President.Pchance === 1) {
            this.M_AliVotes++;
            saveVotesData();
            console.log("Muhammad Ali Votes Increased to " + this.M_AliVotes);
            President.Pchance = 0; // Update the static variable

            var voteButton = document.querySelector('.box-2.M_Ali .vote-btn');
            markAsVoted(voteButton);
        } else {
            showAlert("You have voted for the President already!!");
        }
    }
}

class Haroon extends President {
    constructor() {
        super();
        this.HaroonVotes = 0;
    }

    addHaroonVotes() {
        if (President.Pchance === 1) {
            this.HaroonVotes++;
            saveVotesData();
            console.log("Haroon Votes Increased to " + this.HaroonVotes);
            President.Pchance = 0; // Update the static variable

            var voteButton = document.querySelector('.box-3.Haroon .vote-btn');
            markAsVoted(voteButton);

        } else {
            showAlert("You have voted for the President already!!");
        }
    }
}

class Baji extends President {
    constructor() {
        super();
        this.BajiVotes = 0;
    }

    addBajiVotes() {
        if (President.Pchance === 1) {
            this.BajiVotes++;
            saveVotesData();
            console.log("Haroon Votes Increased to " + this.BajiVotes);
            President.Pchance = 0; // Update the static variable

            var voteButton = document.querySelector('.box-4.baji .vote-btn');
            markAsVoted(voteButton);

        } else {
            showAlert("You have voted for the President already!!");
        }
    }
}

const p1 = new Husnain();
const p2 = new M_Ali();
const p3 = new Haroon();
const p10 = new Baji();



//VICE PRESIDENT//


class VicePresident {
    static Pchance = 1;

    checkChance() {
        if (VicePresident.Pchance === 0) {
            showAlert("You have voted for the Vice President already!!");
        }
    }
}

class Awais extends VicePresident {
    constructor() {
        super();
        this.AwaisVotes = 0;
    }

    addAwaisVotes() {
        if (VicePresident.Pchance === 1) {
            this.AwaisVotes++;
            saveVotesData();
            console.log("Awais Votes Increased to " + this.AwaisVotes);
            VicePresident.Pchance = 0; // Update the static variable

            var voteButton = document.querySelector('.box-1.Awais .vote-btn');
            markAsVoted(voteButton);

        } else {
            showAlert("You have voted for the Vice President already!!");
        }
    }
}

class Abubakar extends VicePresident {
    constructor() {
        super();
        this.AbubakarVotes = 0;
    }

    addAbubakarVotes() {
        if (VicePresident.Pchance === 1) {
            this.AbubakarVotes++;
            saveVotesData();
            console.log("Abubakar Votes Increased to " + this.AbubakarVotes);
            VicePresident.Pchance = 0; // Update the static variable

            var voteButton = document.querySelector('.box-2.Abubakar .vote-btn');
            markAsVoted(voteButton);

        } else {
            showAlert("You have voted for the Vice President already!!");
        }
    }
}



const p4 = new Awais();
const p5 = new Abubakar();



//General Secretary//

class GeneralSecretary {
    static Pchance = 1;

    checkChance() {
        if (GeneralSecretary.Pchance === 0) {
            showAlert("You have voted for the General Secretary already!!");
        }
    }
}

class Hashaam extends GeneralSecretary {
    constructor() {
        super();
        this.HashaamVotes = 0;
    }

    AddHashaamVotes() {
        if (GeneralSecretary.Pchance === 1) {
            this.HashaamVotes++;
            saveVotesData();
            console.log("Hashaam Votes Increased to " + this.HashaamVotes);
            GeneralSecretary.Pchance = 0; // Update the static variable

            var voteButton = document.querySelector('.box-1.Hashaam .vote-btn');
            markAsVoted(voteButton);
        } else {
            showAlert("You have voted for the General Secretary already!!");
        }
    }
}

class Ahad extends GeneralSecretary {
    constructor() {
        super();
        this.AhadVotes = 0;
    }

    addAhadVotes() {
        if (GeneralSecretary.Pchance === 1) {
            this.AhadVotes++;
            saveVotesData();
            console.log("Ahad Votes Increased to " + this.AhadVotes);
            GeneralSecretary.Pchance = 0; // Update the static variable

            var voteButton = document.querySelector('.box-2.Ahad .vote-btn');
            markAsVoted(voteButton);

        } else {
            showAlert("You have voted for the General Secretary already!!");
        }
    }
}


const p6 = new Hashaam();
const p7 = new Ahad();

//person.vote = "voted"; for validating ppl who have voted will get this object property and next time wont be able to vote

function saveVotesData() {
    const presidentData = {
        Husnain: p1.HusnainVotes,
        M_Ali: p2.M_AliVotes,
        Haroon: p3.HaroonVotes
    };

    // Collect data for Vice Presidents
    const vicePresidentData = {
        Awais: p4.AwaisVotes,
        Abubakar: p5.AbubakarVotes,
        
    };

    // Collect data for General Secretaries
    const generalSecretaryData = {
        Hashaam: p6.HashaamVotes,
        Ahad: p7.AhadVotes,
    };

    // Combine all data into a main object
    const allVotesData = {

        Presidents: presidentData,
        VicePresidents: vicePresidentData,
        GeneralSecretaries: generalSecretaryData,
    };

    // Convert data to JSON format
    const jsonData = JSON.stringify(allVotesData);

    // Store JSON data in local storage
    localStorage.setItem('votesData', jsonData);
}



//Load data from local storage->>>>


function loadVotesData() {
    // Load data from local storage
    const savedData = localStorage.getItem('votesData');

    const parsedData = JSON.parse(savedData);

    if (parsedData) {

        p1.HusnainVotes = parsedData.Presidents.Husnain || 0;
        p2.M_AliVotes = parsedData.Presidents.M_Ali || 0;
        p3.HaroonVotes = parsedData.Presidents.Haroon || 0;

        p4.AwaisVotes = parsedData.VicePresidents.Awais || 0;
        p5.AbubakarVotes = parsedData.VicePresidents.Abubakar || 0;

        p6.HashaamVotes = parsedData.GeneralSecretaries.Hashaam || 0;
        p7.AhadVotes = parsedData.GeneralSecretaries.Ahad || 0;

    }
}

loadVotesData();

window.onload = loadVotesData;

saveVotesData(); // Call this when votes are updated or changed

// document.onkeydown = function (e) {
//     if (e.key === 'F12' || (e.key === 'i' && e.ctrlKey && e.shiftKey)) {
//         alert("You have been unauthorized to open these settings");
//         return false;
//     }
// };

function showAlert(message) {
    var alertBox = document.getElementById('myAlert');
    alertBox.textContent = message;
    alertBox.style.display = 'block';
    setTimeout(function() {
        alertBox.style.display = 'none';
    }, 2000);
}

function markAsVoted(button) {
    button.classList.add('voted');
    button.style.backgroundColor = 'rgb(41, 41, 82)';
    button.innerText = 'VOTED';
    button.disabled = true; // Disable the button after voting
}