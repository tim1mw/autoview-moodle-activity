<?PHP // $Id: autoview.php,v 1.2 2003/11/18 07:28:46 moodler Exp $ 
      // autoview.php - created with Moodle 1.2 development (2003111400)

$string['pluginname'] = 'AutoView';
$string['pluginadministration'] = 'AutoView 設定';
$string['alwaysflashstream']='FlashのビデオにはLecture Capture Liveのストリーミング・サーバーを常に用いる';
$string['alwaysflashstream2']='Flashのビデオが付いた全ての新規のプレゼンテーションには、FlashのビデオにはLecture Capture Liveのストリーミング・サーバーを用いることを強制する。';
$string['autoviewtext'] = 'AutoView の名前';
$string['autoviewsummary'] = '概要';
$string['autoview_website'] = 'AutoView のウェブサイト';
$string['chooseconfig'] = '設定(config)ファイルをセットする';
$string['configfile'] = '設定ファイル';
$string['convertsavefailed'] = '変換されたファイルが保存できません';
$string['editbutton'] = '編集モードををOnにする';
$string['editoff'] = '編集モードをOffにする';
$string['modulename'] = 'AutoView';
$string['modulenameplural'] = 'AutoView プレゼンテーション';
$string['xmlsavefailed'] = '設定ファイルの保存に失敗しました';
$string['configconversionurl'] = 'ドキュメント変換サービスのURL';
$string['configconversionurl2'] = 'AutoViewに適したフォーマットのスライドを作成できるドキュメント変換サービスのURL。'.
 'もし適切な、利用可能なドキュメント変換サービスを持っていないなら、ここはブランクにして下さい。ドキュメント変換サービスについては次の所にてより詳しく知ることができます';
$string['configconversionkey'] = 'ドキュメント変換サービスのアクセス・キー';
$string['configconversionkey2'] = 'ドキュメント変換サービスのアクセス・キーです。';
$string['conversiondone'] = 'ドキュメントは変換されました。';
$string['conversionfailed'] = '変換が失敗しました。';
$string['conversionfailed_noerror'] = 'ドキュメント変換システムから、エラーメッセージは何も返って来ていません。動作していないか、間違った設定がされているかもしれません。';
$string['addtext'] = 'プレゼンテーションに対して、変換されたドキュメントのスライドのソースファイルを追加する';
$string['closetext'] ='このウィンドウを閉じる';
$string['file_not_found'] = '変換のために選択されたファイルが、見つかりません。';
$string['xmlhelp']= '多くの場合は、デフォルトの設定ファイルを使います。そのファイルはコースのホーム・ディレクトリに自動的に作成されます。 '.
 'その際はリソースの名前がファイルの名前として使用されます。しかし別の場所からAutoViewのプレゼンテーションをコピーしてきた場合、'.
 ' そのボックスのチェックを外し、プレゼンテーションの .avx 設定ファイルを選択して下さい。AutoViewの設定ファイルの名前と場所を手動で指定したい場合は、そのボックスのチェックを外した上で、'.
 ' 未使用の名前に .avxのファイル拡張子を付けて入力して下さい。';
$string['xmlnote'] = '注意 : まだ使われていないファイル名を選んだ場合、ブランクのせってファイルが自動的に作成されます。';
$string['nojsmessage'] = 'このプレゼンテーションを見るにはJavascriptを有効にする必要があります。';
$string['noxsl'] = '警告 :　適切なXSLパーサーが見つかりません。XSLサポートを有効にしてPHPを再インストール（アップデート）して下さい。 これを行う方法についてのより詳細な情報は、'.
 ' AutoViewモジュールディレクトリのReadMeファイルを読んで下さい。';
$string['pecl_http_warn'] = '警告 : あなたのサーバには、curl または pecl_http の PHP拡張がインストールされていません。'.
 'ドキュメント変換サービスと統合するためには、これらの拡張のどれか一つが必要です。'.
 'もしドキュメント変換サービスを使用するつもりでないなら、この警告は無視して構いません。';
$string['createnew'] = 'デフォルトの AutoView 設定ファイルを使用して下さい（推奨）';
$string['usedir'] = 'AutoViewファイルと設定ファイルのために別の新しいファイルを作って下さい。';

$string['configlivecapture']= 'ライブ・キャプチャのためのJava AppletのURL';
$string['configflashserver']= 'レクチャー・キャプチャ・ライブの rtmp サーバーのURL';
$string['configflashserver2']= 'AutoViewのレクチャー・キャプチャ・ライブのアドオンにアクセスするための rtmpのURLです。レクチャー・キャプチャ・ライブをあなたのシステムにインストールしていなければ、ここはブランクにしておいて下さい。';
$string['configflashcapture']= 'レクチャー・キャプチャ・ライブの http サーバーのURL';
$string['configflashcapture2']= 'AutoView のレクチャー・キャプチャ・ライブのアドオンにアクセスするための http のURLです。'.
 'あなたのシステムにレクチャー・キャプチャ・ライブがインストールされていなければ、ここはブランクにしておいて下さい。レクチャー・キャプチャ・ライブについてのより詳細な情報は以下にあります。';
$string['configflashkey']='Flash サーバーの秘密キー';
$string['configflashdir']='コースのキャプチャされたFlashのファイルのためのサブディレクトリ';
$string['configflashsecurity'] = 'レクチャー・キャプチャ・ライブのサーバー統合のセキュリティーに関する方法';
$string['configflashsecurity2'] = 'レクチャー・キャプチャ・ライブのシステムで使用されるセキュリティーに関する方法です。Moodleでは、ランダム・キーが唯一サポートされている方法です。';
$string['secretkey'] = '秘密キー';
$string['randomkey'] = 'ランダム・キー';
$string['encryptedkey'] = '暗号化されたランダム・キー';
$string['configmax_broadcast_kbps'] = 'ライブ配信用の最大ビデオ帯域（毎秒キロバイト単位）';
$string['configmax_broadcast_kbps2'] = 'ビデオ配信で使用する帯域を制限する場合は、こちらにセットして下さい。';
$string['configmax_record_kbps'] = 'ライブ録画用の最大ビデオ帯域（毎秒キロバイト単位）';
$string['configmax_record_kbps2'] = 'ビデオ録画で使用する帯域を制限する場合は、こちらにセットして下さい。';
$string['config_storage_type'] = 'AutoView のファイル格納場所';
$string['config_storage_type2'] = "この設定は、AutoViewモジュールで用いられるファイルのデフォルトの格納方法を指定します。This setting determines the default storage method for files used by the AutoView module. Changing this setting".
 " この設定を変更することで、既存のファイルの場所は変わりません。新しいプレゼンテーションのみが影響を受けます。できれば、この設定は最初のモジュールの設置が済んだ後は".
 "変更しない方がよいでしょう。<br /><br />もし".
 " <b>内部(Internal) - コース・ファイル</b>を選んだら、Moodle 1.xのユーザーの場合は、全てのファイル（ライブ・ビデオ録画を含む）が通常のMoodle　コースファイルに格納されるでしょう。".
 " Moodle 2.xのユーザーは、このオプションを使うためには、Course File Area repository と Repository File Managerをインストールする必要があります。<!--<br /><br />もし".
 " <b>外部(External) - レクチャー・キャプチャ・ライブ</b>を選んだら、バックエンドのレクチャー・キャプチャ・ライブに全てのファイルが保存されます。このオプションを使うには、レクチャー・キャプチャ・ライブ1.1かそれより改善されたバージョンが必要です。".
 " このMoodleサーバー用のレクチャー・キャプチャ・ライブのホスト設定ファイルにて、ホストタイプが moodle-external として".
 " 設定されているか確かめて下さい。-->";
$string['internal_storage'] = '内部(Internal) - コース・ファイル';
$string['external_storage'] = '外部(External) - レクチャー・キャプチャ・ライブ';
$string['configexternalfilekey'] = '外部ファイルストーレジのためのアクセス・キー';
$string['configexternalfilekey2'] = 'このオプションは、今後使用可能になる予定です。ブランクのままにしておいて下さい。<!-- これは、レクチャー・キャプチャ・ライブのアドオンにてMoodleと外部ファイルストレージ領域との直接通信に用いる秘密キーです。'.
 'もし内部ファイルストレージを使う場合は、このパラミターは'.
 '空白のままにしておくべきものです。-->';
$string['configexternalfileloc'] = '外部ファイルストレージ領域のパス';
$string['configexternalfileloc2'] = 'このオプションは、今後使用可能になる予定です。ブランクのままにしておいて下さい。 <!--もし外部ファイルストレージ領域のファイルシステムの場所がMoodleサーバーから読める場合、ここにファイルのパスを入力して下さい。 '.
 'それにより、AutoView Moodleモジュールが外部に保存されたプレゼンテーション設定ファイルを読むことができ、より強化されたパフォーマンスを行うことができます。'.
 '内部のファイルストレージを用いている場合は、このパラミターはブランクのままにしておいて下さい。-->';

$string['confignote'] = 'これらのパラミターは基本的に';
$string['confignote2'] = 'AutoViewのアドオンサービスを設定するために';
$string['confignote3'] = '用いられます。アドオンサービスを何も使わないのなら、これらはブランクにしておいて下さい。通常の使用で、それらは必要ありません。';
$string['confignote4'] = '詳細については、AutoViewのウェブサイトを参照して下さい。';
$string['hidenav'] = 'Moodleのナビゲーション・バーを隠す';

$string['autoview:addinstance']='AutoViewモジュールを追加できます';
$string['autoview:canedit']='プレゼンテーションを編集できます';
$string['autoview:canrecordflash']='AutoViewのレクチャー・キャプチャ・ライブを用いてビデオを録画できます';
$string['autoview:canbroadcastflash']='AutoViewのレクチャー・キャプチャ・ライブを用いてビデオ配信ができます';
$string['autoview:canconvertdocument']='オンライン・ドキュメント変換サービスを使用できます';
$string['autoview:viewpresentation']='AutoViewのプレゼンテーションを見ることができます';

$string['storagetitle'] = 'ファイル・ストレージ領域';
$string['converttitle'] = 'ドキュメント変換ウェブ・サービス';
$string['flashcapturetitle'] = 'AutoViewレクチャー・キャプチャ・ライブ システム';
$string['javacapturetitle'] = 'Javaアプレット・ベースのライブ・キャプチャ システム';

$string['convertnotallowed']='あなたはドキュメント変換サービスにアクセスする権限がありません';

$string['waitermessage'] = "待って下さい : 右側のプレゼンテーションのロードが終わっても、ここにエディタ機能が現れない場合は、下のボタンをクリックして下さい。";
$string['starteditor'] = 'エディターを起動する';

$string['not_allowed']='あなたはこのプレゼンテーションを見る権限が与えられていません。';
$string['no_edit_permission']= 'あなたはこれを行う権限が与えられていません。';
$string['pres_saved'] ='プレゼンテーションが保存されました。';

$string['advanced_config']='高度な設定';
$string['js_extras'] = 'Javascript のコール';
$string['js_extras2'] = 'Javascript のコールのオプションにより、最初のパラミターのセットアップが終わった後、AutoViewのコードを直接貼り付けることなしに、プラットフォーム全体のJavascriptコールを挿入することができます。'.
 ' これにより、あなたのシステムのデフォルトのAutoViewの動きを変更することができます。'.
 'ただこれは慎重に使用して下さい。基礎となっているAPIメソッドがしばしば変更される可能性もあるためです。';

$string['no_repofileman'] = 'Repository File Manager ブロックがインストールされていません。内部にファイルストレージ領域を持ったMoodle 2.xでAutoViewを用いるときに、これは必要となります。';
$string['no_coursefilearea'] = 'Course File Area repository がインストールされていません。JavaScript のコール';
?>
