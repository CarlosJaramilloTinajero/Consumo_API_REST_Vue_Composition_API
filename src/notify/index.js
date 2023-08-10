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

        default:
            return toast(msg);
            break;
    }
};
// *****************************************

export { notify };