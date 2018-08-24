<?php
	$data = $_POST;
	$data['key'] = 'drowa6fda32df4a6d5f1a3f1d';
	$sign = '';
	ksort($data);
	foreach($data as $k => $v)
	{
		$sign .= $k . '=' . $v;
	}
	$signa['sign'] = sha1($sign);
	
	echo json_encode($signa);
