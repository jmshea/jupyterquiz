// Drag and Drop Matching Question Implementation
class MatchQuestion extends Question {
    constructor(qa, id, idx, opts, rootDiv) {
        super(qa, id, idx, opts, rootDiv);
        this.matches = {};
        this.correctMatches = {};
        
        // Build correct answers map from pairs
        if (this.qa.pairs) {
            this.qa.pairs.forEach((pair, index) => {
                this.correctMatches[pair.label] = pair.answer;
            });
        }
    }

    render() {
        // Set main container class
        this.outerqDiv.className = "MatchQn";
        
        // Override Answer div to use block layout
        if (this.aDiv) {
            this.aDiv.className = 'Answer MatchAns';
        }
        
        // Validate required data
        if (!this.qa.pairs || !this.qa.options) {
            console.error('MatchQuestion requires "pairs" and "options" properties');
            this.fbDiv.innerHTML = 'Error: Invalid question format';
            this.fbDiv.className = 'Feedback incorrect';
            this.wrapper.appendChild(this.fbDiv);
            return;
        }
        
        // Clear any existing content
        this.aDiv.innerHTML = '';
        
        // Create main container
        const mainContainer = document.createElement('div');
        mainContainer.className = 'MatchMainContainer';
        
        // Create labels container
        const labelsDiv = document.createElement('div');
        labelsDiv.className = 'MatchLabels';

        // Get shuffled pairs and options
        let pairs = this.qa.pairs.slice();
        let options = this.qa.options.slice();
        
        if (this.qa.shuffle_pairs !== false) {
            pairs = getRandomSubarray(pairs, pairs.length);
        }
        if (this.qa.shuffle_options !== false) {
            options = getRandomSubarray(options, options.length);
        }

        // Create label rows with drop zones
        pairs.forEach((pair, index) => {
            const labelRow = document.createElement('div');
            labelRow.className = 'MatchLabelRow';
            
            const labelText = document.createElement('div');
            labelText.className = 'MatchLabel';
            labelText.innerHTML = jaxify(pair.label);
            
            const dropZone = document.createElement('div');
            dropZone.className = 'DropZone';
            dropZone.dataset.label = pair.label;
            dropZone.innerHTML = 'Drop here';
            
            this.setupDropZone(dropZone);
            
            labelRow.appendChild(labelText);
            labelRow.appendChild(dropZone);
            labelsDiv.appendChild(labelRow);
        });


        // Create options container
        const optionsDiv = document.createElement('div');
        optionsDiv.className = 'MatchOptions';
        
        const titleDiv = document.createElement('div');
        titleDiv.className = 'MatchTitle';
        titleDiv.innerHTML = 'Drag the options to match with the items:';
        optionsDiv.appendChild(titleDiv);
        
        // Create draggable options
        options.forEach((option, index) => {
            const optionEl = document.createElement('div');
            optionEl.className = 'MatchOption';
            optionEl.draggable = true;
            optionEl.dataset.option = option;
            optionEl.innerHTML = jaxify(option);
            
            this.setupDraggable(optionEl);
            optionsDiv.appendChild(optionEl);
        });
        
        // Assemble the structure
        mainContainer.appendChild(labelsDiv);
        mainContainer.appendChild(optionsDiv);
        this.aDiv.appendChild(mainContainer);

        this.wrapper.appendChild(this.fbDiv);
        this.typeset(this.wrapper);
    }

    setupDraggable(element) {
        element.addEventListener('dragstart', (e) => {
            e.dataTransfer.setData('text/plain', element.dataset.option);
            element.classList.add('dragging');
        });

        element.addEventListener('dragend', (e) => {
            element.classList.remove('dragging');
        });

        // Add click handler for mobile/touch devices
        element.addEventListener('click', (e) => {
            if (element.classList.contains('selected')) {
                element.classList.remove('selected');
                this.selectedOption = null;
            } else {
                // Clear other selections
                this.aDiv.querySelectorAll('.MatchOption.selected').forEach(el => {
                    el.classList.remove('selected');
                });
                element.classList.add('selected');
                this.selectedOption = element.dataset.option;
            }
        });
    }

    setupDropZone(dropZone) {
        dropZone.addEventListener('dragover', (e) => {
            e.preventDefault();
            dropZone.classList.add('dragover');
        });

        dropZone.addEventListener('dragleave', (e) => {
            dropZone.classList.remove('dragover');
        });

        dropZone.addEventListener('drop', (e) => {
            e.preventDefault();
            dropZone.classList.remove('dragover');
            
            const option = e.dataTransfer.getData('text/plain');
            this.placeOptionInDropZone(option, dropZone);
        });

        // Add click handler for mobile/touch devices
        dropZone.addEventListener('click', (e) => {
            if (this.selectedOption) {
                this.placeOptionInDropZone(this.selectedOption, dropZone);
                // Clear selection
                this.aDiv.querySelectorAll('.MatchOption.selected').forEach(el => {
                    el.classList.remove('selected');
                });
                this.selectedOption = null;
            } else if (dropZone.classList.contains('filled')) {
                // Return option to pool when clicking filled drop zone
                const label = dropZone.dataset.label;
                if (this.matches[label]) {
                    this.returnOptionToPool(this.matches[label]);
                    dropZone.innerHTML = 'Drop here';
                    dropZone.classList.remove('filled', 'correct', 'incorrect');
                    delete this.matches[label];
                    this.checkAllMatches();
                    this.preserveResponse(Object.assign({}, this.matches));
                }
            }
        });
    }

    placeOptionInDropZone(option, dropZone) {
        const label = dropZone.dataset.label;
        
        // Clear previous match for this label
        if (this.matches[label]) {
            this.returnOptionToPool(this.matches[label]);
        }
        
        // Remove option from pool
        const optionEl = this.aDiv.querySelector(`[data-option="${option}"]`);
        if (optionEl && optionEl.parentElement.classList.contains('MatchOptions')) {
            optionEl.remove();
        }
        
        // Place in drop zone
        dropZone.innerHTML = jaxify(option);
        dropZone.classList.add('filled');
        
        // Update matches
        this.matches[label] = option;
        
        // Remove immediate feedback - only check if all matches are complete
        this.checkAllMatches();
        this.preserveResponse(Object.assign({}, this.matches));
    }

    returnOptionToPool(option) {
        const optionsDiv = this.aDiv.querySelector('.MatchOptions');
        if (optionsDiv) {
            const optionEl = document.createElement('div');
            optionEl.className = 'MatchOption';
            optionEl.draggable = true;
            optionEl.dataset.option = option;
            optionEl.innerHTML = jaxify(option);
            this.setupDraggable(optionEl);
            optionsDiv.appendChild(optionEl);
        }
    }

    checkAllMatches() {
        // Only show feedback when all pairs have been matched
        if (Object.keys(this.matches).length === Object.keys(this.correctMatches).length) {
            // All matches complete, now show correct/incorrect feedback
            Object.keys(this.matches).forEach(label => {
                const dropZone = this.aDiv.querySelector(`[data-label="${label}"]`);
                if (dropZone) {
                    const isCorrect = this.correctMatches[label] === this.matches[label];
                    if (isCorrect) {
                        dropZone.classList.add('correct');
                        dropZone.classList.remove('incorrect');
                    } else {
                        dropZone.classList.add('incorrect');
                        dropZone.classList.remove('correct');
                    }
                }
            });
            this.updateFeedback();
        } else {
            // Clear any existing feedback classes while matching is incomplete
            Object.keys(this.matches).forEach(label => {
                const dropZone = this.aDiv.querySelector(`[data-label="${label}"]`);
                if (dropZone) {
                    dropZone.classList.remove('correct', 'incorrect');
                }
            });
        }
    }

    updateFeedback() {
        // Check if all matches are complete and correct
        const allMatched = Object.keys(this.correctMatches).every(label => 
            this.matches[label] && this.correctMatches[label] === this.matches[label]
        );

        if (allMatched && Object.keys(this.matches).length === Object.keys(this.correctMatches).length) {
            this.fbDiv.innerHTML = "Excellent! All matches are correct!";
            this.fbDiv.className = "Feedback correct";
        } else {
            const correctCount = Object.keys(this.correctMatches).filter(label => 
                this.matches[label] && this.correctMatches[label] === this.matches[label]
            ).length;
            
            this.fbDiv.innerHTML = `${correctCount}/${Object.keys(this.correctMatches).length} correct matches`;
            this.fbDiv.className = "Feedback";
        }

        this.typeset(this.fbDiv);
    }
}

// Register the question type
Question.register('match', MatchQuestion);