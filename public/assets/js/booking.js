let selected = [];

function generatePassengerCards(count) {
    let container = $('#passenger-details-container');
    container.empty();
    if (!count) return;

    for (let i = 1; i <= count; i++) {
        let card = `
            <div class="wm-card passenger-info-card" style="margin-bottom: 24px; padding: 32px;">
              <h3 style="font-size: 1.3rem; margin-bottom: 24px; font-family: var(--font-display); border-bottom: 1px solid var(--border); padding-bottom: 12px; display: flex; align-items: center; gap: 10px;">
                <i class="fas fa-user" style="color: var(--accent);"></i> Passenger #${i} Details
              </h3>
              <div class="wm-form-group">
                <label style="color: var(--text-secondary); font-weight: 500; display: block; margin-bottom: 8px;">Full Name</label>
                <input type="text" class="wm-input" name="passName[]" placeholder="Enter full name" required>
              </div>
              <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-top: 16px;">
                <div class="wm-form-group">
                  <label style="color: var(--text-secondary); font-weight: 500; display: block; margin-bottom: 8px;">Passport Number</label>
                  <input type="text" class="wm-input" name="passPassport[]" placeholder="Passport number" required>
                </div>
                <div class="wm-form-group">
                  <label style="color: var(--text-secondary); font-weight: 500; display: block; margin-bottom: 8px;">Date of Birth</label>
                  <input type="date" class="wm-input" name="passDob[]" required>
                </div>
              </div>
              <div class="wm-form-group" style="margin-top: 16px; margin-bottom: 0;">
                <label style="color: var(--text-secondary); font-weight: 500; display: block; margin-bottom: 8px;">Assigned Seat</label>
                <select class="wm-select select-bar seatNumber" name="seatNo[]" required>
                  <!-- Seat options populated by seat map selection -->
                </select>
              </div>
            </div>
        `;
        container.append(card);
    }
}

function rebuildSeatDropdowns() {
    selected = [];
    $('.plane input:checked').each(function() {
        selected.push($(this).data('seat'));
    });

    $('.seatNumber').each(function (index) {
        let currentDropdown = '';
        selected.forEach(function (item, sIndex) {
            let isSelected = (index === sIndex) ? 'selected' : '';
            currentDropdown += `<option style="color: #0b0b0b" value="${item}" ${isSelected}>${item}</option>`;
        });
        $(this).html(currentDropdown);
    });
}

// Event handler for seat checkbox changes
$(".plane").on('change', '.seat-check', function () {
    rebuildSeatDropdowns();
});

// Event handler for passenger count dropdown changes
$("#passengers").change(function() {
    let limit = parseInt(this.value, 10);
    if (isNaN(limit)) {
        $('#passenger-details-container').empty();
        return;
    }

    // Uncheck seats that exceed the new limit
    let $checked = $('input.seat-check:checkbox:checked');
    if ($checked.length > limit) {
        $checked.slice(limit).prop('checked', false);
    }

    // Delegate limit enforcement to seats.js enforceLimit()
    if (typeof enforceLimit === 'function') enforceLimit();

    generatePassengerCards(limit);
    rebuildSeatDropdowns();
});

// Run once on load to initialize if there is an existing count
$(document).ready(function() {
    let passCount = $("#passengers").val();
    if (passCount !== undefined && passCount !== "") {
        let limit = parseInt(passCount, 10);
        generatePassengerCards(limit);
        rebuildSeatDropdowns();
    }
});