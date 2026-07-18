import styles from '@/components/common/styles/button.module.css';

const Button = ({ type, text, onClick, cover, disabled }: { 
    type?: 'submit' | 'reset' | 'button', 
    text: string, 
    onClick?: () => void, 
    cover?: boolean, 
    disabled?: boolean
}) => {
    return (
        <button 
            type={ type }
            className={ `${styles.button} ${cover && styles.cover} ${disabled && styles.disabled}` } 
            onClick={ onClick } 
            disabled={ disabled } 
        >
            { text }
        </button>
    );
};

export default Button;