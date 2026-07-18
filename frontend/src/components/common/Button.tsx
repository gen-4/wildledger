import styles from '@/components/common/styles/button.module.css';

const Button = ({ text, onClick, cover, disabled }: 
    { text: string, onClick?: () => void, cover?: boolean, disabled?: boolean}) => {
    return (
        <button 
            className={ `${styles.button} ${cover && styles.cover} ${disabled && styles.disabled}` } 
            onClick={ onClick } 
            disabled={ disabled } 
        >
            { text }
        </button>
    );
};

export default Button;