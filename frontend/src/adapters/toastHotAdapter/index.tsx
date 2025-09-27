import toast from "react-hot-toast";
import { ToastInfo } from "../../components/Toasts/ToastInfo";

export const notify = {
    sucess: (message: string) =>
        toast.custom(<ToastInfo message={message} type="sucess" />, {
            id: "toast-sucess",
            duration: 5 * 1000,
        }),

    error: (message: string) =>
        toast.custom(
            <ToastInfo message={message} type="error" dismissible={false} />,
            {
                id: "toast-error",
                duration: 5 * 1000,
            }
        ),

    info: (msg: string) =>
        toast.custom(<ToastInfo message={msg} type="info" />, {
            id: "info-toast",
            duration: 5 * 1000,
        }),
    warning: (msg: string) =>
        toast.custom(
            <ToastInfo message={msg} type="warning" dismissible={false} />,
            {
                id: "warning-toast",
                duration: 5 * 1000,
            }
        ),
} as const;
