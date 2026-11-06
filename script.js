let ticketCounter = 1;
const tickets = [];

document.getElementById("ticketForm").addEventListener("submit", function(event) {
    event.preventDefault();
    addTicket();
    filter();
});

document.getElementById("statusFilter").addEventListener("change", filter);

function createTicketRow(ticket) {
    const li = document.createElement("li");

    const p1 = document.createElement("p");
    p1.textContent = "Id: " + ticket.id;

    const p2 = document.createElement("p");
    p2.textContent = "Title: " + ticket.title;

    const p3 = document.createElement("p");
    p3.textContent = "Status: " + ticket.status;

    const p4 = document.createElement("p");
    p4.textContent = "Priority: " + ticket.priority;

    li.appendChild(p1);
    li.appendChild(p2);
    li.appendChild(p3);
    li.appendChild(p4);

    return li;
}

function dataSanitization(id, title, status, priority) {
    const messageEl = document.getElementById("message_add");
    
    if (tickets.length >= 1000) {
        if (messageEl) messageEl.textContent = "The maximum limit of 1000 tickets has been reached.";
        return false;
    }

    if (!id || typeof id !== "string" || id.trim().length === 0 || id.length > 100) {
        if (messageEl) messageEl.textContent = "Invalid ticket ID.";
        return false;
    }

    const trimmedTitle = title ? title.trim() : "";
    if (trimmedTitle.length < 3 || trimmedTitle.length > 80) {
        if (messageEl) messageEl.textContent = "The title must be between 3 and 80 characters long.";
        return false;
    }

    if (status !== 'new' && status !== 'doing' && status !== 'done') {
        if (messageEl) messageEl.textContent = "Invalid ticket status.";
        return false;
    }

    if (priority !== 'low' && priority !== 'normal' && priority !== 'high') {
        if (messageEl) messageEl.textContent = "Invalid ticket priority.";
        return false;
    }

    if (messageEl) messageEl.textContent = "";
    return true;
}

function addTicket() {
    const form = document.getElementById('ticketForm');
    const formData = new FormData(form);

    const rawTitle = formData.get('title') || "";
    const cleanTitle = rawTitle.trim();
    const priority = formData.get('priority') || "normal";
    const status = 'new';
    const id = String(ticketCounter);

    if (dataSanitization(id, cleanTitle, status, priority)) {
        tickets.push({
            id: id,
            title: cleanTitle,
            status: status,
            priority: priority
        });

        ticketCounter += 1;
        form.reset();
    }
}

function filter() {
    const value_filter = document.getElementById("statusFilter").value;
    const list = document.getElementById("ticketList");

    list.innerHTML = "";

    let visibleCount = 0;

    for (let i = 0; i < tickets.length; i++) {
        if (value_filter === "all" || tickets[i].status === value_filter) {
            const ticketRow = createTicketRow(tickets[i]);
            list.appendChild(ticketRow);
            visibleCount++;
        }
    }

    if (visibleCount === 0) {
        const emptyLi = document.createElement("li");
        emptyLi.textContent = "No tickets to display.";
        emptyLi.style.textAlign = "center";
        emptyLi.style.fontStyle = "italic";
        list.appendChild(emptyLi);
    }

    document.getElementById("visibleCount").textContent = visibleCount;
    document.getElementById("totalCount").textContent = tickets.length;
}

function changeStatus() 
{
    let ticketId = document.getElementById("ticketId").value;
    let newStatus = document.getElementById("newStatus").value;

    if (ticketId.trim() === "" || isNaN(ticketId)) 
    {
        document.getElementById("message_change").textContent = "Ticket ID must be a number.";
        return;
    }

    let found = false;

    for (let i = 0; i < tickets.length; i++) 
    {
        if (Number(ticketId) === Number(tickets[i].id)) 
        {
            tickets[i].status = newStatus;
            found = true;
            break;
        }
    }

    if (!found)
    {
        document.getElementById("message_change").textContent = "No ticket found with this ID.";
        return;
    }

    document.getElementById("message_change").textContent = "Ticket status updated successfully.";
    filter();
}