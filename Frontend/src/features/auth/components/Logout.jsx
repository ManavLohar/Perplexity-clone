import React from "react";
import { motion, AnimatePresence } from "motion/react";
import { useAuth } from "../hooks/useAuth";
import { useDispatch } from "react-redux";
import { setCurrentChatId } from "../../chat/chat.slice";

const Logout = ({ isLogoutOpen, setIsLogoutOpen }) => {
  const dispatch = useDispatch();
  const { handleLogout } = useAuth();
  return (
    <AnimatePresence>
      {isLogoutOpen ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed flex z-20 h-screen w-full bg-black/40 backdrop-blur-xs justify-center items-center"
        >
          <motion.div
            initial={{ scale: 0.95 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0.95 }}
            className="flex flex-col gap-8 p-8 border border-gray-700 rounded-2xl min-w-80 md:w-full max-w-100 bg-zinc-900"
          >
            <h3 className="text-white text-lg md:text-2xl font-extrabold">
              Are you sure!
            </h3>
            <div className="flex flex-row gap-2">
              <button
                className="text-cyan-500 text-[12px] md:text-sm w-fit font-extrabold px-3 py-1 rounded-md border-2 border-cyan-500 cursor-pointer"
                onClick={() => setIsLogoutOpen(!isLogoutOpen)}
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  handleLogout();
                  dispatch(setCurrentChatId(null));
                }}
                className="text-white text-[12px] md:text-sm w-fit px-3 py-1 font-extrabold rounded-md bg-cyan-500 cursor-pointer"
              >
                Logout
              </button>
            </div>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
};

export default Logout;
