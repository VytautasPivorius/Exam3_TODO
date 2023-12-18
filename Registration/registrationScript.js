window.onload = () => {

    document.getElementById('btn-submit').addEventListener("click", (event)=>{
        event.preventDefault();

        const formToRegister = {
            UserName: `${document.getElementById('firstName').value}`,
            Password: `${document.getElementById('password').value}`,
            Email: `${document.getElementById('email').value}`
        };

        fetch(`https://localhost:7171/api/Auth`,
        {
            method:'POST',
            headers:{
                'Content-type': 'application/json'
            },
            body: JSON.stringify(formToRegister)
        })
        .then(result => {
            console.log('registered successfuly')
            showNotification("Registered successfuly")
        })
        .catch(error => showNotification(error));
        
    })

    function showNotification(message){
        const box = document.getElementById('notificationBox');
        box.innerHTML = `<p>${message}</p>`
    }
}

