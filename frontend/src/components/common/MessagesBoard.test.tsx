import { vi } from 'vitest';
import { act, render, screen } from '@testing-library/react';
import { configureStore, type EnhancedStore } from '@reduxjs/toolkit';
import { Provider } from 'react-redux';

import { MessagesBoard } from '@/components/common';
import appReducer, { addMessage, clearMessage, clearMessages } from '@/store/appSlice';
import { MessageType, type MessagesState } from '@/store/types';

globalThis.ResizeObserver = class ResizeObserver {
    observe() {}
    unobserve() {}
    disconnect() {}
};

const createMockStore = (initialState: MessagesState = { messages: [] }) =>
    configureStore({
        reducer: { app: appReducer },
        preloadedState: { app: initialState },
    });

const renderWithStore = (store: EnhancedStore) =>
    render(
        <Provider store={store}>
            <MessagesBoard />
        </Provider>
    );

describe('Message Board', () => {
    
    describe('empty state', () => {
        it('shows empty board', () => {
            renderWithStore(createMockStore());
            expect(screen.queryAllByRole('span').length).toBe(0);
        });
    });

    describe('messages are created', () => {
        it('shows one message in board', () => {
            const store = createMockStore();
            renderWithStore(store);
            act(() =>
                store.dispatch(addMessage({
                    id: '',
                    message: 'One message',
                    type: MessageType.INFO,
                    autoDismiss: true,
                    dismissing: false
                }))
            );
            expect(screen.queryByText('One message')).toBeInTheDocument();
        });

        it('shows two message in board', () => {
            const store = createMockStore();
            renderWithStore(store);
            act(() => {
                store.dispatch(addMessage({
                    id: '',
                    message: 'One message',
                    type: MessageType.INFO,
                    autoDismiss: true,
                    dismissing: false
                }));
                store.dispatch(addMessage({
                    id: '',
                    message: 'Two messages',
                    type: MessageType.INFO,
                    autoDismiss: true,
                    dismissing: false
                }));
            });
            expect(screen.queryByText('One message')).toBeInTheDocument();
            expect(screen.queryByText('Two messages')).toBeInTheDocument();
        });
    });

    describe('messages are cleared', () => {
        it('shows one message in board and gets cleared', () => {
            const store = createMockStore();
            renderWithStore(store);
            act(() => 
                store.dispatch(addMessage({
                    id: '',
                    message: 'One message',
                    type: MessageType.INFO,
                    autoDismiss: true,
                    dismissing: false
                }))
            );
            expect(screen.queryByText('One message')).toBeInTheDocument();
            act(() =>
                store.dispatch(clearMessage(store.getState().app.messages.find(
                    (message) => message.message === 'One message'
                )!.id))
            );
            expect(screen.queryByText('One message')).not.toBeInTheDocument();
        });

        it('shows two messages in board and one gets cleared', () => {
            const store = createMockStore();
            renderWithStore(store);
            act(() => {
                store.dispatch(addMessage({
                    id: '',
                    message: 'One message',
                    type: MessageType.INFO,
                    autoDismiss: true,
                    dismissing: false
                }));
                store.dispatch(addMessage({
                    id: '',
                    message: 'Two messages',
                    type: MessageType.INFO,
                    autoDismiss: true,
                    dismissing: false
                }));
            });
            expect(screen.queryByText('One message')).toBeInTheDocument();
            expect(screen.queryByText('Two messages')).toBeInTheDocument();
            act(() =>
                store.dispatch(clearMessage(store.getState().app.messages.find(
                    (message) => message.message === 'One message'
                )!.id))
            );
            expect(screen.queryByText('One message')).not.toBeInTheDocument();
            expect(screen.queryByText('Two messages')).toBeInTheDocument();
        });

        it('shows two messages in board and they get cleared', () => {
            const store = createMockStore();
            renderWithStore(store);
            act(() => {
                store.dispatch(addMessage({
                    id: '',
                    message: 'One message',
                    type: MessageType.INFO,
                    autoDismiss: true,
                    dismissing: false
                }));
                store.dispatch(addMessage({
                    id: '',
                    message: 'Two messages',
                    type: MessageType.INFO,
                    autoDismiss: true,
                    dismissing: false
                }));
            });
            expect(screen.queryByText('One message')).toBeInTheDocument();
            expect(screen.queryByText('Two messages')).toBeInTheDocument();
            act(() =>
                store.dispatch(clearMessages())
            );
            expect(screen.queryByText('One message')).not.toBeInTheDocument();
            expect(screen.queryByText('Two messages')).not.toBeInTheDocument();
        });
    });

    describe('messages are dimissed', () => {
        beforeEach(() => { vi.useFakeTimers(); });
        afterEach(() => { vi.useRealTimers(); });

        it('shows one message in board and gets autodismissed', () => {
            const store = createMockStore();
            renderWithStore(store);
            act(() => 
                store.dispatch(addMessage({
                    id: '',
                    message: 'One message',
                    type: MessageType.INFO,
                    autoDismiss: true,
                    dismissing: false
                }))
            );
            expect(screen.queryByText('One message')).toBeInTheDocument();
            act(() => vi.advanceTimersByTime(5 * 1000));
            expect(screen.queryByText('One message')).not.toBeInTheDocument();
        });

        it('shows one message in board and gets dismissed by click', () => {
            const store = createMockStore();
            renderWithStore(store);
            act(() =>
                store.dispatch(addMessage({
                    id: '',
                    message: 'One message',
                    type: MessageType.INFO,
                    autoDismiss: true,
                    dismissing: false
                }))
            );
            expect(screen.queryByText('One message')).toBeInTheDocument();
            act(() => screen.getByText('One message').click());
            expect(screen.queryByText('One message')).toBeInTheDocument();
            act(() => vi.advanceTimersByTime(1 * 1000));
            expect(screen.queryByText('One message')).not.toBeInTheDocument();
        });
    });

});