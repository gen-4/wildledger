import styles from '@/components/common/styles/button.module.css';

const Button = ({ text, onClick, cover }: { text: string, onClick?: () => void, cover?: boolean}) => {
    return (
        <button className={ `${styles.button} ${cover && styles.cover}` } onClick={ onClick } >
            { text }
        </button>
    );
};

export default Button;