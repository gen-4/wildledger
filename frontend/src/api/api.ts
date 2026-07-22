const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api/0.1.0';

let isRefreshing = false;
let failedQueue: Array<{ resolve: (token: string) => void; reject: (error: Error) => void }> = [];

const processQueue = (error: Error | null, token: string | null = null) => {
  failedQueue.forEach(({ resolve, reject }) => {
    if (error) {
      reject(error);
    } else {
      resolve(token!);
    }
  });
  failedQueue = [];
};

const request = async (
    endpoint: string, 
    options: RequestInit & { _retry?: boolean } = {},
    { useAccessToken = true, isJson = true }: { useAccessToken?: boolean; isJson?: boolean; } = {}
): Promise<Response> => {
    const url = `${API_URL}${endpoint}`;
    const token = localStorage.getItem('accessToken');

    const {_retry, ...fetchOptions} = options;
    const config: RequestInit & { headers: Record<string, string>; _retry?: boolean } = {
        ...fetchOptions,
        headers: {
        ...(options.headers as Record<string, string> || {}),
        },
    };
    isJson ? config.headers['Content-Type'] = 'application/json' : null;

    if ( useAccessToken && token ) {
        config.headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(url, config);

    // Handle 401/403 - try refresh token (with mutex)
    if ( (response.status === 401 || response.status === 403) && !options._retry  && endpoint !== '/auth/login' ) {
        if (endpoint === '/auth/refresh') {
            processQueue(new Error('Refresh failed'));
            localStorage.removeItem('accessToken');
            localStorage.removeItem('refreshToken');
            window.location.href = '/login';
            return response;
        }

        if (isRefreshing) {
            // Queue this request to retry after the ongoing refresh completes
            return new Promise<string>((resolve, reject) => {
                failedQueue.push({ resolve, reject });
            }).then((newToken: string) => {
                config.headers['Authorization'] = `Bearer ${newToken}`;
                return fetch(url, { ...config, _retry: true } as RequestInit & {_retry?: boolean});
            });
        }

        isRefreshing = true;
        const refreshToken = localStorage.getItem('refreshToken');

        if (!refreshToken) {
            isRefreshing = false;
            localStorage.removeItem('accessToken');
            localStorage.removeItem('refreshToken');
            window.location.href = '/login';
            return response;
        }

        try {
            const refreshResponse = await fetch(`${API_URL}/auth/refresh`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ refreshToken }),
            });

            if (refreshResponse.ok) {
                const data: { accessToken: string; refreshToken: string } = await refreshResponse.json();
                localStorage.setItem('accessToken', data.accessToken);
                localStorage.setItem('refreshToken', data.refreshToken);
                processQueue(null, data.accessToken);

                config.headers['Authorization'] = `Bearer ${data.accessToken}`;
                return fetch(url, { ...config, _retry: true } as RequestInit & {_retry?: boolean});

            } else {
                processQueue(new Error('Refresh failed'));
                localStorage.removeItem('accessToken');
                localStorage.removeItem('refreshToken');
                window.location.href = '/login';
                return response;
            }

        } catch {
            processQueue(new Error('Refresh failed'));
            localStorage.removeItem('accessToken');
            localStorage.removeItem('refreshToken');
            window.location.href = '/login';
            return response;

        } finally {
            isRefreshing = false;
        }
    }

    return response;
}

export const api = {
    get: (endpoint: string) => request(endpoint, { method: 'GET' }),

    post: (endpoint: string, body?: unknown, useAccessToken: boolean = true) =>
        request(
            endpoint, 
            {
                method: 'POST',
                body: JSON.stringify(body)
            },
            { useAccessToken }
        ),

    postFile: (endpoint: string, file: File, body?: Object) => {
        const formData = new FormData();
            formData.append('file', file);
            formData.append('sightingRequest', new Blob(
                [JSON.stringify(body)],
                { type: 'application/json' }
            ));

        return request(
            endpoint, 
            { method: 'POST', body: formData }, 
            { isJson: false }
        );
    },

    put: (endpoint: string, body?: unknown) =>
        request(endpoint, {
            method: 'PUT',
            body: JSON.stringify(body),
        }),

    delete: (endpoint: string) => request(endpoint, { method: 'DELETE' }),
};

export default api;