setInterval(() => {
    let i = document.getElementById("timer").innerHTML
    i = parseInt(i)
    i += 1;
    document.getElementById("timer").innerHTML = i
}, 1000)