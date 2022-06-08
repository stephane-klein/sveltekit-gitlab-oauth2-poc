<script context="module">
    export const hydrate = false;
    export async function load({ params, fetch, session, stuff }) {
        console.log('loading');
        return {
            status: 200
        }
    };
</script>
