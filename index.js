const hoursToSeconds = (hours) => {
    return hours * 60 * 60;
}

const time = 2000 //hoursToSeconds(2);

const fetchTask1 = () => {
    setInterval(() => {
        const fetchData = async () => {
            const response = await fetch("http://localhost:3000/task1");
            const data = await response.json();
            if (response.success == false) {
                console.log("Error");
            }
            else{
                console.log(data);
            }
        }
        fetchData();
    }, time)
}

fetchTask1();