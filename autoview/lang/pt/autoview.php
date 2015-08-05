<?PHP // $Id: label.php,v 1.2 2003/11/18 07:28:46 moodler Exp $ 
      // start.php - created with Moodle 1.2 development (2003111400)

$string['autoviewtext'] = 'AutoView Nome';
$string['autoviewsummary'] = 'Índice';
$string['chooseconfig'] = 'Escolha o arquivo de configuração';
$string['configfile'] = 'Arquivo de Configuração';
$string['convertsavefailed'] = 'Não foi possível salvar o documento convertido';
$string['editbutton'] = 'Trocar para modo de edição';
$string['editoff'] = 'Sair do modo de edição';
$string['modulename'] = 'AutoView';
$string['modulenameplural'] = 'AutoView Presentations';
$string['xmlsavefailed'] = 'Falha ao salvar o arquivo de configuração';
$string['configconversionurl'] = 'URL serviço de conversão de documento';
$string['configconversionkey'] = 'Chave de acesso ao serviço de configuração do documento';
$string['conversiondone'] = 'O documento foi convertido.';
$string['conversionfailed'] = 'Falha na conversão';
$string['xmlhelp']= 'Na maioria dos casos, você vai querer usar o arquivo padrão de configuração. Este será criado automaticamente para você, no diretório raiz do curso.'.
 'using the resource name as a file name. However, if you have copied an AutoView presentation from another'.
 ' location, uncheck the box and select the .avx configuration file for that presentation here. You may also uncheck the box and enter'.
 ' an unused file name here with the .avx file extension if you want to specify the name and location of the AutoView configuration file manually.';
$string['xmlnote'] = 'Nota: se você escolher um nome para o arquivo de configuração aqui que ele ainda não exista, um arquivo de configuração em branco será criado automaticamente.';
$string['noxsl'] = 'Aviso : No suitable XSL parser has been found. Please update your PHP with XSL support enabled. Please see the ReadMe file in the autoview module'.
 ' directory for more information on how to do this';
$string['pecl_http_warn'] = 'Aviso : A extensãp PHP pecl_http não esta instalada no seu servidor. You will need this to use the '.
 'document conversion service. The module can be downloaded from http://pecl.php.net/package/pecl_http/ . If you do not intend to use '.
 'a document conversion service this warning can be ignored.';
$string['createnew'] = 'Usar o arquivo padrão de configuração (recomendado)';

$string['configlivecapture']= 'Live capture java applet URL';
$string['configflashserver']= 'Flash/Red5 communication server URL';
$string['configflashcapture']= 'Flash based live capture URL';
$string['configflashkey']='Chave secreta do Flash server';
$string['configflashdir']='Subdirectory for captured flash files in course';
$string['configflashsecurity'] = 'Metodo de integração seguro Flash/Red 5 server';
$string['secretkey'] = 'Chave secreta';
$string['randomkey'] = 'Chave randônica';
$string['encryptedkey'] = 'Chave Randônica encriptografada';

$string['confignote'] = 'Estes parâmetros são usados para configurar';
$string['confignote2'] = 'add-on services';
$string['confignote3'] = 'Para AutoView. Deixe-os em branco se você não estiver usando qualquer add-on de serviços, eles não são necessários para utilização normal.';
$string['confignote4'] = 'Veja o site do AutoView para maiores detalhes';
$string['hidenav'] = 'Esconder a barra de navegação do moodle';

$string['autoview:canedit']='Pode Editar apresentações';
$string['autoview:canrecordflash']='Pode gravar videos usando flash baseados em captura ao vivo';
$string['autoview:canconvertdocument']='Pode usar serviço online de conversão de documento';

$string['converttitle'] = 'Web Service de conversão de documento';
$string['flashcapturetitle'] = 'Flash based live capture system';
$string['javacapturetitle'] = 'Java applet basead live capture system';

$string['convertnotallowed']='Você não esta autorizado a acessar o serviço de conversão de documentos';

$string['waitermessage'] = 'Por favor, aguarde: Se as funções do editor não aparecerem aqui quando o quadro a direita terminar de carregar, clique no botão a seguir';
$string['starteditor'] = 'Iniciar editor';
?>
