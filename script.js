// Resets body to clear all EventListener
function clearEvents() {
    // Get the body of the page
    const body = document.body
    // Create a cloneNode without EventListener
    const new_body = body.cloneNode(true)
    // Replaces the body
    body.parentNode.replaceChild(new_body, body)
}

// Sets all necessary EventListener
function setEvents() {
    // Get all Kanbans, Dropzones and Buttons
    const kanbans = document.querySelectorAll('.kanban')
    const dropzones = document.querySelectorAll('.dropzone')
    const svgButtons = document.querySelectorAll('.svg-button')

    // Adds EventListener for all Kanbans
    for(kanban of kanbans) {
        // Makes kanban draggable if it doesn't contain the 'non-draggable' class
        if (!kanban.classList.contains('non-draggable'))
            kanban.setAttribute('draggable', true)

        // Adds class 'being-dragged' to the kanban when the drag starts
        kanban.addEventListener('dragstart', e => {
            e.target.classList.add('being-dragged')
        })

        // Removes class 'being-dragged' from the kanban when the drag ends
        kanban.addEventListener('dragend', e => {
            e.target.classList.remove('being-dragged')

        })
        
    }

    // Adds EventListener for all Dropzones
    for (dropzone of dropzones) {
        // Adds class 'dz-hilight' to the Dropzone when the dragged object
        // enters it
        dropzone.addEventListener('dragenter', e => {
            if(e.target.classList.contains('dropzone')) {
                e.preventDefault()
                e.target.classList.add('dz-highlight')
            }

        })

        // Makes the dropzone valid while the dragged object is over it
        dropzone.addEventListener('dragover', e => {
            if(e.target.classList.contains('dropzone')) {
                e.preventDefault()
            }

        })

        // Removes class 'dz-hilight' from the Dropzone when the dragged object
        // leaves it
        dropzone.addEventListener('dragleave', e => {
            if(e.target.classList.contains('dropzone')) {
                e.target.classList.remove('dz-highlight')
            }

        })
        
        // Handles the drop Event
        dropzone.addEventListener('drop', e => {
            if(e.target.classList.contains('dropzone')) {
                // Find which Kanban was being dragged
                const element = document.querySelector('.being-dragged')
                // Remove it from its original Dropzone
                element.parentNode.removeChild(element)
                // Add the dragged Kanban to the new Dropzone
                e.target.appendChild(element)
                // Removes the 'dz-highlight' from the Dropzone
                e.target.classList.remove('dz-highlight')
            }

        })
        
    }

    // Adds EventListener for all buttons
    for (button of svgButtons) {
        // Opens the Modal when the button is clicked
        button.addEventListener('click', openModal)
    }
}

// Function to open the Modal
function openModal(e) {
    // Gets the references for all modal parts
    const modalUnfocus = document.querySelector('.unfocus')
    const modalBox = document.querySelector('.modal')
    const cancelButton = document.querySelector('button.cancel')
    const confirmButton = document.querySelector('button.confirm')

    // Find which button was clicked and if the operation is to add or edit
    const target = e.target.closest('.svg-button')
    const modalType = target.className.split(' ').pop()

    // Makes the unfocus visible
    modalUnfocus.classList.add('uf-modal')    
    modalUnfocus.classList.add('active')
    // Makes the Modal visible
    modalBox.classList.add('active')

    // Adds the EventListener for closing the Modal (Cancel Button or Click Out)
    modalUnfocus.addEventListener('click', closeModal)
    cancelButton.addEventListener('click', closeModal)

    // Gets the reference for the Kanban Content Textarea
    const modalTextarea = document.querySelector('textarea')
    // Handles the input Event for the Textarea
    modalTextarea.addEventListener('input', e => {
        // Auto resize the textarea to fit all lines
        e.target.style.height = 'auto'
        e.target.style.height = (e.target.scrollHeight) + 'px'
    })

    // Gets the references for the components of the priority selector
    const priorityButton = document.querySelector('button.priority')
    const selectPriority = document.querySelector('.select-priority')
    // Makes the selector visible when the button is clicked
    priorityButton.addEventListener('click', e => {
        selectPriority.classList.add('active')
    })

    // Get the references for all priority options
    const selectOptions = document.querySelectorAll('.select-option')
    // Adds the click EventListener for all priority options
    for (option of selectOptions) {
        option.addEventListener('click', e => {
            // Resets the priorityButton's priority level
            priorityButton.classList.remove('critical')
            priorityButton.classList.remove('important')
            priorityButton.classList.remove('alarming')
            priorityButton.classList.remove('low')

            // Get the priority level from the button pressed
            const priority = e.target.closest('.select-option').className.split(' ').pop()
            // Apply the new priority level to the priorityButton
            priorityButton.classList.add(priority)

            // Hides the priority selector
            selectPriority.classList.remove('active')
        })
    }

    // Get the contents of the Modal's Kanban
    const modalPiority = document.querySelector('button.priority')
    const modalTitle = document.querySelector('input.kanban-title')
    const modalContent = document.querySelector('textarea.kanban-content')
    // Get the Modal Header
    const modalHeader = document.querySelector('.modal .title')

    // Functionality when the clicked button was the Add Button
    if (modalType === 'add-button') {
        // Sets the inicial values for all of the new Kanban contents
        modalPiority.classList.add('low')
        modalTitle.value = 'Kanban Title'
        modalContent.innerHTML = 'Kanban Content'
        // Sets the Header Text
        modalHeader.classList.replace('edit-header', 'add-header')

        // Handles the click Event on the confirmButton
        confirmButton.addEventListener('click', e => {
            // Instantiate a clone of the new Kanban
            const newKanban = document.querySelector('.non-draggable').cloneNode(true)
            // Makes it draggable
            newKanban.classList.remove('non-draggable')

            // Instantiate and removes the priority selector
            const prioritySelector = newKanban.querySelector('.select-priority')
            prioritySelector.parentNode.removeChild(prioritySelector)

            // Instantiate and enables the Edit Button
            const editButton = newKanban.querySelector('.edit-button')
            editButton.removeAttribute('disabled')

            // Instantiate the new Kanban's contents
            const newPriority = newKanban.querySelector('.priority')
            let newTitle = newKanban.querySelector('.kanban-title')
            let newContent = newKanban.querySelector('.kanban-content')

            // Saves it's current values
            const newTitleValue = newTitle.value
            const newContentValue = newContent.value

            // Replaces it's tag names
            newPriority.outerHTML = newPriority.outerHTML.replace(/button/g, 'div')
            newTitle.outerHTML = newTitle.outerHTML.replace(/input/g, 'span')
            newContent.outerHTML = newContent.outerHTML.replace(/textarea/g, 'span')

            // Reinstantiate the Kanban Title, sets it's value and resets it's
            // attributes
            newTitle = newKanban.querySelector('.kanban-title')
            newTitle.innerHTML = newTitleValue
            newTitle.removeAttribute('maxlength')
            newTitle.removeAttribute('value')
            newTitle.removeAttribute('type')

            // Reinstantiate the Kanban Content, sets it's value and removes
            // it's style attribute
            newContent = newKanban.querySelector('.kanban-content')
            newContent.innerHTML = newContentValue
            newContent.removeAttribute('style')

            // Focus the sections
            modalUnfocus.classList.remove('uf-modal')
            // Hides the Modal
            modalBox.classList.remove('active')

            // Instantiate all sections
            const sections = document.querySelectorAll('.section')
            for (section of sections) {
                // Adds the the hover efect to all sections
                section.classList.add('section-select')
                // Handles the click Event on the sections
                section.addEventListener('click', e => {
                    // Instantiate the section's Dropzone
                    const dropzone = e.target.closest('.section').querySelector('.dropzone')
                    // Add the new Kanban to the Dropzone
                    dropzone.innerHTML += newKanban.outerHTML

                    // Close the Modal
                    closeModal(undefined)
                })
            }

        })
    }

    // Functionality when the clicked button was the Edit Button
    if (modalType === 'edit-button') {
        // Sets the Header Text
        modalHeader.classList.replace('add-header', 'edit-header')
        // Instantiates the curret Kanban to be edited
        const currentKanban = target.closest('.kanban')
        
        // Instantiate the current Kanban's priority element and class
        const currentPriorityEl = currentKanban.querySelector('.priority')
        const currentPriority = currentPriorityEl.className.split(' ').pop()
        // Sets the Modal's priority to be the same as the Kanban's priority
        modalPiority.classList.add(currentPriority)

        // Instantiate the current Kanban's title element and value
        const currentTitleEl = currentKanban.querySelector('.kanban-title')
        const currentTitle = currentTitleEl.innerHTML
        // Sets the Modal's title to be the same as the Kanban's title
        modalTitle.value = currentTitle

        // Instantiate the current Kanban's content element and value
        const currentContentEl = currentKanban.querySelector('.kanban-content')
        const currentContent = currentContentEl.innerHTML
        // Sets the Modal's content to be the same as the Kanban's content
        modalContent.innerHTML = currentContent
        // Auto resizes the Modal's content textarea
        modalContent.style.height = 'auto'
        modalContent.style.height = (modalContent.scrollHeight) + 'px'

        // Handles the click event for the confirm button
        confirmButton.addEventListener('click', e => {
            // Instantiate the Modal's Kanban
            const newKanban = document.querySelector('.non-draggable')

            // Finds the new values for the priority, the title and the content
            const newPriority = newKanban.querySelector('.priority').className.split(' ').pop()
            const newTitle = newKanban.querySelector('.kanban-title').value
            const newContent = newKanban.querySelector('.kanban-content').value

            // Updates the current Kanban's values to the new values
            currentPriorityEl.classList.replace(currentPriority, newPriority)
            currentTitleEl.innerHTML = newTitle
            currentContentEl.innerHTML = newContent

            // Close the Modal
            closeModal(undefined)
        })
    }
}

// Function to close the Modal
function closeModal(e) {
    // Gets the references for the modal parts and all the sections
    const modalUnfocus = document.querySelector('.unfocus')
    const modalBox = document.querySelector('.modal')
    const sections = document.querySelectorAll('.section')
    
    // Hides the unfocus
    modalUnfocus.classList.remove('uf-modal')
    modalUnfocus.classList.remove('active')
    // Hides the Modal
    modalBox.classList.remove('active')

    // Remove the hover on all sections
    for (section of sections) {
        section.classList.remove('section-select')
    }

    // Wait for transitions and reset all Events
    setTimeout(() => {
        clearEvents()
        setEvents()        
    }, 700)
}

// Sets all EventListeners when page loads
setEvents()