// ************  Toastyfy  *****************
// Los estilos estan en el style.css
import { toast } from "vue3-toastify";
import 'vue3-toastify/dist/index.css';
const notify = (msg = '', type = 'default') => {
    switch (type) {
        case 'success':
            return toast.success(msg);
            break;

        case 'info':
            return toast.info(msg);
            break;

        case 'warning':
            return toast.warn(msg);
            break;

        case 'error':
            return toast.error(msg);
            break;

        case 'loading':
            return toast.loading(msg);
            break;

        default:
            return toast(msg);
            break;
    }
};

// Funcion para actualizar las notificaciones con toastify
const updateNotify = (id, msg = '', type = 'error') => {
    toast.update(id, {
        render: msg,
        autoClose: true,
        closeOnClick: true,
        closeButton: true,
        type: type,
        isLoading: false
    });
};
// *****************************************

export { notify, updateNotify };