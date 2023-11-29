import { useAtom } from "jotai";
import { modalAtom } from "../../data/store";
import { motion, AnimatePresence } from "framer-motion";
import Icon from "../Icon/Icon";

export default function Modal (props: any) {
  const [modal, modalSet] = useAtom(modalAtom);
  function close() {
    modalSet((prev) => {
      const next = Object.assign({}, prev); // new object so react updates the object
      next.active = false;
      return next;
    });
  }
  return (
    <AnimatePresence>
      {modal.active && (
        <div className="z-[100] fixed top-0 left-0 w-screen h-screen flex-center">
          <motion.div
            onClick={close}
            initial={{ opacity: 0 }}
            transition={{ duration: 0.2, ease: "easeInOut" }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, transition: { duration: 0.4, delay: 0.2 } }}
            className="z-[10] fixed top-0 left-0 w-screen h-screen bg-[#000] bg-opacity-30 backdrop-blur-sm flex-center"
          ></motion.div>
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3, delay: 0.1, ease: "easeInOut" }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="relative z-[20] border bg-white rounded-lg mx-6 min-w-[300px] max-w-[550px]"
          >
            <div className="w-full border-b grid grid-cols-[1fr_36px]">
              <div className="pl-4 py-2">{modal.title}</div>
              <button
                className="flex-center transition h-full fill-[#333] hover:fill-[#fff] top-0 right-0 border-0 border-[#333]"
                onClick={close}
              >
                <Icon type="close" className="h-[28px] w-[28px]" />
              </button>
            </div>
            <div style={{whiteSpace: "pre-line"}} className="p-4">{modal.body}</div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
