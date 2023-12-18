window.onload = () => {

    document.getElementById('btn-submit').addEventListener("click", (event)=>{
        event.preventDefault();

        const userName = document.getElementById('firstName').value
        const password = document.getElementById('password').value

        fetch(`https://localhost:7171/api/Auth?username=${userName}&password=${password}`,
        {
            method:'GET',
            headers:{
                'Content-type': 'application/json'
            },
        })
        .then(response => {
            if(response.ok){
                window.location.href = '../ToDo/toDoApp.html'
                return response.json()
               
            }
            else{
                alert("Neteisingi prisijungimo duomenys")
                return;
            }
        })
        .then(result => {
            console.log(result);
            sessionStorage.setItem('userName',`${result.userName}`);
            sessionStorage.setItem('userId',`${result.id}`);
            
        })
        .catch(error => console.log(error));
        
    })
}