import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
    stages: [
        { duration: '30s', target: 20 }, // Ramp up to 20 users
        { duration: '1m', target: 20 },  // Stay at 20 users
        { duration: '30s', target: 0 },  // Ramp down
    ],
    thresholds: {
        http_req_duration: ['p(95)<500'], // 95% of requests must complete below 500ms
    },
};

export default function () {
    const params = {
        headers: {
            'User-Agent': 'k6-load-test',
        },
    };

    // Test Homepage
    const resHome = http.get('http://localhost:3000', params);
    check(resHome, {
        'homepage status is 200': (r) => r.status === 200,
        'homepage lcp candidates': (r) => r.body.includes('job'),
    });

    // Test Jobs Page
    const resJobs = http.get('http://localhost:3000/jobs', params);
    check(resJobs, {
        'jobs status is 200': (r) => r.status === 200,
    });

    sleep(1);
}
