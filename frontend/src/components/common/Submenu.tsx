import { useNavigate } from 'react-router-dom';

import styles from '@/components/common/styles/submenu.module.css';
import { SubmenuItemType, type SubmenuData} from '@/components/common/types';

const Submenu = ({ data }: { data: SubmenuData }) => {
    const navigate = useNavigate();

    return (
        <div className={ styles.submenu }>
            { data.map((item, index) => {
                switch(item.type) {
                    case SubmenuItemType.SEPARATOR:
                        return <hr key={ index } className={ styles.separator } />
                    
                    case SubmenuItemType.BUTTON:
                        return <div 
                            key={ index }
                            className={ styles.item } 
                            onClick={ item.action }
                        >{ item.text }</div>

                    case SubmenuItemType.LINK_ENTRY:
                        return <div 
                            key={ index }
                            className={ styles.item } 
                            onClick={ () => navigate(item.link ? item.link : '') }
                        >{ item.text }</div>
                }
            }) }
        </div>
    );
};

export default Submenu;