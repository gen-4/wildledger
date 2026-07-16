import styles from '@/components/common/styles/button.module.css';

const Button = ({ text, onClick }: { text: string, onClick?: () => void}) => {
    return (
        <button className={ styles.button } onClick={ onClick } >
            { text }
        </button>
    );
};

export default Button;