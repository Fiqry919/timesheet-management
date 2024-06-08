class Utils {
    formatRp(n: number) {
        return new Intl.NumberFormat("id-ID", {
            style: "currency",
            currency: "IDR"
        }).format(n).replace(/^Rp\s+|,00$/g, '')
    }

    formatDate(dateString?: string) {
        if (!dateString) return
        const months = ['jan', 'feb', 'mar', 'apr', 'mei', 'jun', 'jul', 'aug', 'sep', 'okt', 'nov', 'dec'];
        const date = new Date(dateString);
        const day = date.getDate();
        const month = months[date.getMonth()];
        const year = date.getFullYear();
        return `${day} ${month} ${year}`;
    }

    formatTime(dateString?: string) {
        if (!dateString) return
        const date = new Date(dateString.replace('Z', ''));
        const hours = date.getHours().toString().padStart(2, '0');
        const minutes = date.getMinutes().toString().padStart(2, '0');
        return `${hours}:${minutes}`;
    }
    /**
    * @format yyyy-MM-dd HH:mm:ss
    */
    formatTimestamp(format: string = 'yyyy-MM-dd HH:mm:ss', dateString?: string) {
        const date = dateString ? new Date(dateString) : new Date()

        const year = date.getFullYear().toString();
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const day = date.getDate().toString().padStart(2, '0');
        const hour = date.getHours().toString().padStart(2, '0');
        const minute = date.getMinutes().toString().padStart(2, '0');
        const second = date.getSeconds().toString().padStart(2, '0');

        return format.replace('yyyy', year).replace('MM', month).replace('dd', day)
            .replace('HH', hour).replace('mm', minute).replace('ss', second);
    }

    secondsToDuration(seconds: number) {
        const isNegative = seconds < 0;
        const d = Math.abs(seconds) * 1000; // change to ms
        const days = Math.floor(d / (1000 * 60 * 60 * 24));
        const hours = Math.floor((d % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((d % (1000 * 60 * 60)) / (1000 * 60));

        let durationStr = '';
        if (days !== 0) {
            durationStr += `${isNegative ? -days : days} hari `;
        }
        if (hours !== 0) {
            durationStr += `${isNegative ? -hours : hours} jam `;
        }
        if (minutes !== 0) {
            durationStr += `${isNegative ? -minutes : minutes} menit`;
        }

        return durationStr.trim()
    }

    sumArray<T>(arr: T[], key: keyof T): number {
        return arr.reduce((acc, obj) => acc + Number(obj[key]), 0);
    }

    omit<T, K extends keyof T>(obj: T, keys: K[]): Omit<T, K> {
        const result = { ...obj };

        for (const key of keys) {
            delete result[key];
        }

        return result;
    }

    debounce = (func: Function, delay: number) => {
        let timeout: NodeJS.Timeout;
        return (...args: any[]) => {
            clearTimeout(timeout);
            timeout = setTimeout(() => {
                func(...args);
            }, delay);
        };
    }

    capitalize = (str: string) => {
        return str.charAt(0).toUpperCase() + str.slice(1);
    }
}

export default new Utils