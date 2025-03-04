'use strict';

const openModal = () => {
    document.getElementById('modal').classList.add('active');
};

const closeModal = () => {
    clearFields();
    document.getElementById('modal').classList.remove('active');
};

const tempClient = {
    nome: 'dorival',
    email: 'dorivasmateus122333@gmail.com',
    celular: '33998087393',
    cidade: 'Caratinga'
};

const getLocalStorage = () => JSON.parse(localStorage.getItem('db_client')) ?? [];

const setLocalStorage = (dbClient) => localStorage.setItem('db_client', JSON.stringify(dbClient));

// CRUD - create, read, update, delete

// CRUD - DELETE
const deleteClient = (index) => {
    const dbClient = readClient();
    dbClient.splice(index, 1);
    setLocalStorage(dbClient);
    updateTable();
};

// CRUD - UPDATE
const updateClient = (index, client) => {
    const dbClient = readClient();
    dbClient[index] = client;
    setLocalStorage(dbClient);
    updateTable();
};

// CRUD - READ
const readClient = () => getLocalStorage();

// CRUD - CREATE
const createClient = (client) => {
    const dbClient = getLocalStorage();
    dbClient.push(client);
    setLocalStorage(dbClient);
    updateTable();
};

const isValidFields = () => document.getElementById("form").reportValidity();

// Interação com o layout

const clearFields = () => {
    const fields = document.querySelectorAll('.modal-field');
    fields.forEach(field => field.value = '');
    document.getElementById('nome').dataset.index = 'new';
};

const saveClient = () => {
    if (isValidFields()) {
        const client = {
            nome: document.getElementById('nome').value,
            email: document.getElementById('email').value,
            celular: document.getElementById('celular').value,
            cidade: document.getElementById('cidade').value
        };
        
        const index = document.getElementById('nome').dataset.index;
        
        if (index === 'new') {
            createClient(client);
        } else {
            updateClient(index, client);
        }
        
        closeModal();
    }
};

const createRow = (client, index) => {
    const newRow = document.createElement('tr');
    newRow.innerHTML = `
        <td>${client.nome}</td>
        <td>${client.email}</td>
        <td>${client.celular}</td>
        <td>${client.cidade}</td>
        <td>
            <button type="button" class="button green" id="edit-${index}">editar</button>
            <button type="button" class="button red" id="delete-${index}">excluir</button>
        </td>
    `;
    document.querySelector('#tableClient>tbody').appendChild(newRow);
};

const clearTable = () => {
    const rows = document.querySelectorAll('#tableClient>tbody tr');
    rows.forEach(row => row.parentNode.removeChild(row));
};

const updateTable = () => {
    const dbClient = readClient();
    clearTable();
    dbClient.forEach(createRow);
};

const fillFields = (client, index) => {
    document.getElementById('nome').value = client.nome;
    document.getElementById('email').value = client.email;
    document.getElementById('celular').value = client.celular;
    document.getElementById('cidade').value = client.cidade;
    document.getElementById('nome').dataset.index = index;
};

const editClient = (index) => {
    const client = readClient()[index];
    fillFields(client, index);
    openModal();
};

const editDelete = (event) => {
    if (event.target.type === 'button') {
        const [action, index] = event.target.id.split('-');

        if (action === 'edit') {
            editClient(index);
        } else if (action === 'delete') {
            const client = readClient()[index]
            const response = confirm(`Deseja realmente excluir o cliente ${client.nome}`)
            if (response == true){
                deleteClient(index);
            } else {

            }
          
        }
    }
};

updateTable();

// Eventos
document.getElementById('cadastrarCliente').addEventListener('click', openModal);

document.getElementById('modalClose').addEventListener('click', closeModal);

document.getElementById('salvar').addEventListener('click', saveClient);

document.querySelector('#tableClient>tbody').addEventListener('click', editDelete);
