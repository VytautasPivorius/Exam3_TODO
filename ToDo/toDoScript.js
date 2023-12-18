window.onload = () => {
    
    const currentUser = sessionStorage.getItem('userName');
    const currentUserID = sessionStorage.getItem('userId');

    showTasks();
    showCurrentUser();

    //FUNKCIJA - PARODOMAS DABARTINIS PRISIJUNGES USERIS
    function showCurrentUser(){
        document.getElementById("currentUserBox").textContent=`Prisijunges: ${currentUser}`;
    }

    //EVENT - KVIECIAMAS FILTRAS
    document.getElementById('btn-filter').addEventListener('change', function () {
        document.getElementById('new-column').innerHTML='';
        document.getElementById('wip-column').innerHTML='';
        document.getElementById('done-column').innerHTML='';
        showTasks();
    });

    //EVENT - KVIECIAMAS LOGOUT
    document.getElementById('btn-logOut').addEventListener('click', function () {
        window.location.href = '/index.html'
    });

    //FUNKCIJA RODOMOS VISOS UZDUOTYS PAGAL KRITERIJUS
    function showTasks(){
        fetch(`https://localhost:7171/api/ToDo`,
        {
            method:'GET',
            headers:{
                'Content-type': 'application/json'
            },
        })
        .then(response => response.json())
        .then(result => {
    
            const toDoColumn = document.getElementById('new-column');
            toDoColumn.innerHTML = ''; // Clear existing content
    
            for(let item of result){
                
                const formattedDate = new Date(item.endDate).toLocaleDateString();
                
                let currentColumn = ``;

                let filter = filterTaskByType(item,document.getElementById('btn-filter').value)

                if(item.userId === currentUserID && item.status ==="new" && filter){
                    currentColumn = document.getElementById('new-column');
                    currentColumn.innerHTML+=`
                <tr>
                    ${createTaskContainer(item,formattedDate)}
                </tr>
                
                `;
                }
                else if(item.userId === currentUserID && item.status ==="wip" && filter){
                    currentColumn = document.getElementById('wip-column');
                    currentColumn.innerHTML+=`
                <tr>
                    ${createTaskContainer(item,formattedDate)}
                </tr>
                
                `;
                }
                else if(item.userId === currentUserID && item.status ==="done" && filter){
                    currentColumn = document.getElementById('done-column');
                    currentColumn.innerHTML+=`
                <tr>
                    ${createTaskContainer(item,formattedDate)}
                </tr>
                
                `;
                }
                else{
                    continue;
                }
            }
        })
        .catch(error => console.log(error));
    
    }

    //FUNKCIJA - SUKURIAMAS UZDUOTIES BLOKAS
    function createTaskContainer(item, formattedDate){

        if(item.userId === currentUserID){
            return `
            <td>
                <div id='task-box'>
                    <button id='task-btn-Edit' onclick='popupEditTask(${item.id},"${item.content}","${item.endDate}")'>
                        <img class="img-icon-small" src="../Icon/edit.png" alt="Edit Task">
                    </button>
    
                    <button id='task-btn-Delete' onclick='deleteTask(${item.id})'>
                        <img class="img-icon-small" src="../Icon/delete.png" alt="Delete Task">
                    </button>
    
                    <span id='task-type'>${item.type}</span>
                    <div id='task-content'>${item.content}</div>
                    ${checkDate(formattedDate)}
                </div>
            </td>
            `;
        }
        else{
            return ``;
        }
    }

    //FUNKCIJA - DATOS TIKRINIMAS AR UZDUOTIS VELUOJA AR NE
    function checkDate(formattedDate){
        const endDateTime = new Date(formattedDate);
    
        if(new Date() > endDateTime){
            return `<div id='task-date-late'>${formattedDate}</div>`
        }
        else{
    
            return `<div id='task-date'>${formattedDate}</div>`
    
        }
    }
    
}

//FUNKCIJA - FILTRUOJAMOS UZDUOTYS PAGAL JU STATUSA
function filterTaskByType(item,filter){
    if(filter === "All"){
        return true;
    }
    else if(filter === item.type){
        return true;
    }
    else{
        return false;
    }
}

//FUNKCIJA - KURIAMA UZDUOTIS IR IRASOMA I DUOMENU BAZE
function createTask(){
    
        const formToCreate = {
            userId: `${sessionStorage.getItem('userId')}`,
            type: `${document.getElementById('new-tsk-type').value}`,
            content: `${document.getElementById('new-tsk-content').value}`,
            endDate: `${document.getElementById('new-tsk-date').value}`,
            status: `new`
        };
    
        fetch(`https://localhost:7171/api/ToDo`,
        {
            method:'POST',
            headers:{
                'Content-type': 'application/json'
            },
            body: JSON.stringify(formToCreate)
        })
        .then(response =>response.json())
        .then(result => {
            console.log('registered successfuly');
        })
        .catch(error => console.log(error));
    
}

//FUNKCIJA - KOREGUOJAMA ESAMA UZDUOTIS
function editTask(id){
    
    const formToEdit = {
        userId: `${sessionStorage.getItem('userId')}`,
        type: `${document.getElementById('edit-tsk-type').value}`,
        content: `${document.getElementById('edit-tsk-content').value}`,
        endDate: `${document.getElementById('edit-tsk-date').value}`,
        status: `${document.getElementById('edit-tsk-status').value}`,
        id: `${id}`
    };

    fetch(`https://localhost:7171/api/ToDo/${id}`,
    {
        method:'PUT',
        headers:{
            'Content-type': 'application/json'
        },
        body: JSON.stringify(formToEdit)
    })
    .then(response =>response.json())
    .then(result => {
        console.log('registered successfuly');
    })
    .catch(error => console.log(error));

}

//FUNKCIJA - ISTRINAMA ESAMA UZDUOTIS PAGAL ID
function deleteTask(id){
   
        fetch(`https://localhost:7171/api/ToDo/${id}`,
        {
            method:'DELETE',
            headers:{
                'Content-type': 'application/json'
            },
        })
        .then(result => {
            console.log('successfuly');
            location.reload();
        })
        .catch(error => console.log(error));
}

//FUNKCIJA - RODOMAS NAUJOS KURIAMOS UZDUOTIES LANGAS
function PopupNewTask(){
    const popup = document.getElementById('mainBody');
    popup.innerHTML += `
    <form id="taskForm">
            <h2 style="text-align: center;">Nauja uzduotis</h2>
            <label class="tsk-label" for="new-tsk-type">Tipas:</label>
            <select class="tsk-input" id="new-tsk-type">
                <option value="Personal">Personal</option>
                <option value="Work">Work</option>
                <option value="Study">Study</option>
            </select>

            <label class="tsk-label" for="new-tsk-content">Tekstas:</label>
            <textarea class="tsk-area" id="new-tsk-content" name="content"></textarea>

            <label class="tsk-label" for="new-tsk-date">Data:</label>
            <input class="tsk-input" type="date" id="new-tsk-date"/>

            <button class="btn-submit" id="btn-task-submit" onclick="createTask()">Submit</button>
            <button class="btn-submit" id="btn-task-cancel" onclick='window.close()'>Close</button>
    </form>
    `
}

//FUNKCIJA - RODOMAS ESAMOS REDAGUOJAMOS UZDUOTIES LANGAS
function popupEditTask(id,content, date){
    const popup = document.getElementById('mainBody');
    const todayDate = new Date(date).toLocaleDateString('en-CA')
    popup.innerHTML += `
    <form id="taskEditForm">
            <h2 style="text-align: center;">Redagavimas</h2>
            <label class="tsk-label" for="edit-tsk-type">Tipas:</label>
            <select class="tsk-input" id="edit-tsk-type">
                <option value="Personal">Personal</option>
                <option value="Work">Work</option>
                <option value="Study">Study</option>
            </select>

            <label class="tsk-label" for="edit-tsk-content">Tekstas:</label>
            <textarea class="tsk-area" id="edit-tsk-content" name="content">${content}</textarea>

            <label class="tsk-label" for="edit-tsk-date">Data:</label>
            <input class="tsk-input" type="date" id="edit-tsk-date" value="${todayDate}"/>

            <label class="tsk-label" for="edit-tsk-status">Statusas:</label>
            <select class="tsk-input" id="edit-tsk-status">
                <option value="new">New</option>
                <option value="wip">Work in progress</option>
                <option value="done">Done</option>
            </select>

            <button class="btn-submit" id="btn-task-submit" onclick="editTask(${id})">Submit</button>
            <button class="btn-submit" id="btn-task-cancel" onclick='window.close()'>Close</button>
        </form>
    
    `
}

