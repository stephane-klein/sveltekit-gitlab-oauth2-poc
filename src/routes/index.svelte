<script>
	import { session } from '$app/stores';
</script>

<p>User infos:</p>

<ul>
    <li>username: {$session.username || '-'}</li>
    <li>name: {$session.name || '-'}</li>
</ul>

<p>Pages:</p>
<ul>
    <li><a href="/login/">Login</a></li>
    <li><a href="/logout/">Logout</a></li>
</ul>

