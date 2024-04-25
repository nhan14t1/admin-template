const Swal = require('sweetalert2');

const baseAlert = (message, type, duration = 2000, confirmButton) => {
  Swal.fire({
    position: "top",
    icon: type,
    title: message,
    showConfirmButton: confirmButton,
    timer: duration
  });
}

export const successAlert = (message, duration = undefined, confirmButton = false) => {
  baseAlert(message, 'success', duration, confirmButton);
}

export const infoAlert = (message, duration = undefined, confirmButton = false) => {
  baseAlert(message, 'info', duration, confirmButton);
}

export const warningAlert = (message, duration = undefined, confirmButton = false) => {
  baseAlert(message, 'warning', duration, confirmButton);
}

export const errorAlert = (message, duration = undefined, confirmButton = false) => {
  baseAlert(message, 'error', duration, confirmButton);
}

const baseConfirm = (title, message, type, callback) => {
  Swal.fire({
    title,
    text: message,
    icon: type,
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText: "Có",
    cancelButtonText: 'Không'
  }).then((result) => {
    callback(result.isConfirmed);
  });
}

export const deleteConfirm = (title, message, callback) => {
  baseConfirm(title, message, 'warning', callback);
}

export const infoConfirm = (title, message, callback) => {
  baseConfirm(title, message, 'info', callback);
}