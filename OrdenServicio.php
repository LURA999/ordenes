<?php

include "Conn.php";

$dbConn = connect($db);

if($_SERVER['REQUEST_METHOD'] == 'POST'){

    $sql = $dbConn->prepare("CALL sp_insertOrdenServicio('".$_GET['fecha_asignacion']."','".$_GET['cve_usuario']."', 
    ".$_GET['cve_instalador'].", '".$_GET['fecha_programada']."', '".$_GET['cve_cliente']."', '".$_GET['cve_sucursal']."', '
    ".$_GET['servicio']."', '".$_GET['cve_contacto']."', '".$_GET['desc_problema']."', '".$_GET['cve_ticket']."')");
    $sql->execute();
    $sql->setFetchMode(PDO::FETCH_ASSOC);
    header("HTTP/1.1 200 OK");
    echo json_encode( $sql->fetchAll()  );
    exit();
}

if($_SERVER['REQUEST_METHOD'] == 'GET'){

    $sql = $dbConn->prepare("CALL selectOrdenes");
    $sql->execute();
    $sql->setFetchMode(PDO::FETCH_ASSOC);
    header("HTTP/1.1 200 OK");
    echo json_encode( $sql->fetchAll()  );
    exit();
}


header("HTTP/1.1 400 Bad Request");

?>