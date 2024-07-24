
let currentsong = new Audio();
let songs;
let currFolder;
function convertSecondsToMinuteSeconds(seconds) {
  if (isNaN(seconds) || seconds < 0) {
    return "00:00"
  }
  // Calculate minutes and remaining seconds
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);

  // Format minutes and seconds with leading zeros if needed
  const formattedMinutes = String(minutes).padStart(2, '0');
  const formattedSeconds = String(remainingSeconds).padStart(2, '0');

  // Return the formatted string
  return `${formattedMinutes}:${formattedSeconds}`;
}


async function getsongs(folder) {
  currFolder = folder;
  // let a = await fetch(`https://192.168.0.109:5500/${folder}/`)
  let a = await fetch(`/${folder}/`)

  // let a = await fetch(`/songs/`)

  let response = await a.text();
  let div = document.createElement("div")
  div.innerHTML = response;
  let as = div.getElementsByTagName("a")
  songs = []
  for (let index = 0; index < as.length; index++) {
    const element = as[index];
    if (element.href.endsWith(".mp3")) {
      songs.push(element.href.split(`/${folder}/`)[1])
    }

  }




  //shows all sng in playlist
  let songUL = document.querySelector(".songlist").getElementsByTagName("ul")[0]
  songUL.innerHTML = ""
  for (const song of songs) {
    songUL.innerHTML = songUL.innerHTML + `<li><img class="invert" src="img/music.svg" alt="play"/>


      <div class="info">
      <div>${song.replaceAll("%20", " ")} </div>
        <div>Vikas</div>
      </div>


      <div class="playnow">
        <span>Play Now</span>
        <img src="img/play.svg" class="invert" alt="play" />
      </div>

    </li>`;
  }

  //Attach an eventlistner to each song
  Array.from(document.querySelector(".songlist").getElementsByTagName("li")).forEach(e => {
    e.addEventListener("click", element => {

      // console.log(e.querySelector(".info").firstElementChild.innerHTML);


      playMusic(e.querySelector(".info").firstElementChild.innerHTML.trim())
    })


  })
 return songs
}

const playMusic = (track, pause = false) => {
  // let audio = new Audio("/songs/" + tack)
  currentsong.src = `/${currFolder}/` + track
  currentsong.onloadedmetadata = () => {
  currentsong.play()
  if (!pause) {
    currentsong.play()
    play.src = "img/pause.svg"
  }
};
  document.querySelector(".songinfo").innerHTML = decodeURI(track)
  document.querySelector(".songtime").innerHTML = "00:00/00:00"
}


async function displayAlbums() {
  // let a = await fetch(`https://192.168.0.109:5500/songs/`)
  let a = await fetch(`/songs/`)
  // let a = await fetch(`/songs/`) //Jab isko Host karenge tab httpss: wala use nahi kar sakte hai but aise chalane ke liye wahi use hoga
  let response = await a.text();
  let div = document.createElement("div")
  div.innerHTML = response;
  let anchors = div.getElementsByTagName("a")
  // console.log(anchors);
  
  let cardContainer = document.querySelector(".cardContainer")
  let array = Array.from(anchors)

  
  for (let index = 0; index < array.length; index++) {
    const e = array[index];
    if (e.href.includes("/songs/") && !e.href.includes(".htaccess")){
      // console.log(e.href);
      
      // console.log(e.href.split("/").slice(-1)[0]);
      let folder = e.href.split("/").slice(-1)[0];



      //GEt the metadata of the folder
      let a = await fetch(`/songs/${folder}/info.json`)
      let response = await a.json();
      // console.log(response)
      cardContainer.innerHTML = cardContainer.innerHTML + ` <div data-folder="${folder}" class="card">
      <div class="play">
        <svg xmlns="httpss://www.w3.org/2000/svg" viewBox="0 0 48 48" width="48" height="48">
          <circle class="bg-circle" cx="24" cy="24" r="24" />
          <circle class="inner-circle" cx="24" cy="24" r="20" />
          <path class="path"
            d="M19 22.3996V25.6004C19 28.639 19 30.1583 19.9115 30.7724C20.823 31.3864 22.0695 30.707 24.563 29.3482L27.4993 27.7476C30.4998 26.1124 32 25.2948 32 24C32 22.7052 30.4998 21.8876 27.4993 20.2524L24.563 18.6518C22.0695 17.293 20.823 16.6136 19.9115 17.2276C19 17.8417 19 19.361 19 22.3996Z" />
        </svg>
      </div>
      <img src="/songs/${folder}/cover.jpg" alt="">
      <h2>${response.title}</h2>
      <p>${response.description}</p>
     </div> `

    }
  }


  //Load the playlist whenever card is clicked
  Array.from(document.getElementsByClassName("card")).forEach(e => {
    e.addEventListener("click", async item => {
      songs = await getsongs(`songs/${item.currentTarget.dataset.folder}`)
playMusic(songs[0])
    })
  })
}



async function main() {


  //to get the list of all songs
  // await getsongs("songs/Arijit singh")
  // playMusic(songs[0], true) //  Activate this code when we have to play song directly when we visit website and in await gatesong(song/ yaha wo folder ka naam jiska gaana automatically play karna hai)

  //display all the albums on the page
  displayAlbums();




  //Attach an event listner to play, next and previous
  play.addEventListener("click", () => {
    if (currentsong.paused) {
      currentsong.play()
      play.src = "img/pause.svg"
    } else {
      currentsong.pause()
      play.src = "img/play.svg"
    }
  })

  //listen for timeupdate event
  currentsong.addEventListener("timeupdate", () => {

    document.querySelector(".songtime").innerHTML = `${convertSecondsToMinuteSeconds(currentsong.currentTime)}/${convertSecondsToMinuteSeconds(currentsong.duration)}`
    //to move seekbar
    document.querySelector(".circle").style.left = (currentsong.currentTime / currentsong.duration) * 100 + "%";
  })

  //add an eventlstner to seekbar so we can move it manually
  document.querySelector(".seekbar").addEventListener("click", e => {
    let percent = (e.offsetX / e.target.getBoundingClientRect().width) * 100;
    document.querySelector(".circle").style.left = percent + "%";
    currentsong.currentTime = ((currentsong.duration) * percent) / 100
  })

  //add an event listner to hamburger to open hamburger after click
  document.querySelector(".hamburger").addEventListener("click", () => {
    document.querySelector(".left").style.left = "0"
  })

  //add an event listner to hamburger to close hamburger after click
  document.querySelector(".close").addEventListener("click", () => {
    document.querySelector(".left").style.left = "-130%"

  })
  

  //Add an event listner to previous
  previous.addEventListener("click", () => {
    console.log('previous clicked');
    console.log('current song');
    let index = songs.indexOf(currentsong.src.split("/").slice(-1)[0])
    if ((index - 1) >= 0) {
      playMusic(songs[index - 1])
    }

  })

  //Add an event listner to and next
  next.addEventListener("click", () => {
    console.log('next clicked');
    let index = songs.indexOf(currentsong.src.split("/").slice(-1)[0])
    if ((index + 1) < songs.length) {
      playMusic(songs[index + 1])
    }
  })
  //Add an event listner to volume
  document.querySelector(".range").getElementsByTagName("input")[0].addEventListener("change", (e) => {
    currentsong.volume = parseInt(e.target.value) / 100
    if (currentsong.volume > 0){
      document.querySelector(".volume>img").src = document.querySelector(".volume>img").src.replace("img/mute.svg", "img/volume.svg")
    }
    if (currentsong.volume == 0){
      document.querySelector(".volume>img").src = document.querySelector(".volume>img").src.replace("img/volume.svg", "img/mute.svg")
    }
  })


//Add an event listner to mute the track

document.querySelector(".volume > img").addEventListener("click", e =>{
  // console.log(e.target);
  // console.log("changing", e.target.src);
  
  if(e.target.src.includes("volume.svg")){
   e.target.src = e.target.src.replace("volume.svg", "mute.svg")
    currentsong.volume = 0;
    document.querySelector(".range").getElementsByTagName("input")[0].value = 0;
  }
  else{
    e.target.src = e.target.src.replace("mute.svg","volume.svg" )
    currentsong.volume = .10;
    document.querySelector(".range").getElementsByTagName("input")[0].value = 10;
  }
  
})
};


main()



