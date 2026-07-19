import appReducer, { addMessage, clearMessage, clearMessages } from '@/store/appSlice';
import { MessageType } from '@/store/types';

describe('appSlice', () => {

    describe('messages reducers', () => {
        it('addMessage adds message', () => {
            const initialState = { messages: [] };
            const state = appReducer(initialState, addMessage({
                id: '',
                type: MessageType.INFO,
                message: 'test message',
                autoDismiss: true,
                dismissing: false
            }));
            expect(state.messages.length).toBe(1);
            expect(state.messages[0].id).toBeTruthy();
        });

        it('clearMessage clears message', () => {
            const initialState = { messages: [
                {
                    id: '1',
                    type: MessageType.INFO,
                    message: 'test message',
                    autoDismiss: true,
                    dismissing: false
                },
                {
                    id: '2',
                    type: MessageType.INFO,
                    message: 'test message',
                    autoDismiss: true,
                    dismissing: false
                }
            ] };
            const state = appReducer(initialState, clearMessage('1'));
            expect(state.messages.length).toBe(1);
            expect(state.messages[0].id).toBe('2');
        });

        it('clearMessage does not clear unexistent message', () => {
            const initialState = { messages: [
                {
                    id: '1',
                    type: MessageType.INFO,
                    message: 'test message',
                    autoDismiss: true,
                    dismissing: false
                },
                {
                    id: '2',
                    type: MessageType.INFO,
                    message: 'test message',
                    autoDismiss: true,
                    dismissing: false
                }
            ] };
            const state = appReducer(initialState, clearMessage('3'));
            expect(state.messages.length).toBe(2);
        });

        it('clearMessages clears messages', () => {
            const initialState = { messages: [
                {
                    id: '1',
                    type: MessageType.INFO,
                    message: 'test message',
                    autoDismiss: true,
                    dismissing: false
                },
                {
                    id: '2',
                    type: MessageType.INFO,
                    message: 'test message',
                    autoDismiss: true,
                    dismissing: false
                }
            ] };
            const state = appReducer(initialState, clearMessages());
            expect(state.messages.length).toBe(0);
        });

    });

});