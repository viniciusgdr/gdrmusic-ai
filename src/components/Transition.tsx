import  { motion } from 'framer-motion';

const transitionVariants = {
  initial: {
    x: '100%',
    width: '100%',
  },
  animate: {
    x: '0%',
    width: '0%',
  },
  exit: {
    x: ['0%', '100%'],
    width: ['0%', '100%'],
  }
}

const Transition = () => {
  return (
    <>
      <motion.div
        variants={transitionVariants}
        initial='initial'
        animate='animate'
        transition={{ duration: 1 }}
        exit='exit'
        className='h-1 bg-gradient-to-r from-[#ff0080] to-[#7928ca] rounded-full'
      />
    </>
  );
};

export default Transition;