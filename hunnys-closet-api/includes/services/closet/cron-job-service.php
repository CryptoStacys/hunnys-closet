<?php

class CronJobService {
    public function __construct() {
        // include all templates/hooks/templates
        $this->registerHooks();
    }

    function registerHooks () {
        // Register hooks
        add_action( 'hunnys_dollys_check_cron_job', array($this, 'trigger_dollys_check_cron_job'));
    }

    static function trigger_dollys_check_cron_job() {
        // $url = "https://staging-hunnys-closet-2-548f5ed67a1b.herokuapp.com/check";
        $url = "http://217.160.247.57/hunnys-aws-closet-service/check";

        $opts = array(
            'http'=>array(
            'method'=> "GET",
            'header'=> "X-API-Key: abc123"
            )
        );

        $context = stream_context_create($opts);
        
        // // Open the file using the HTTP headers set above
        $file = file_get_contents($url, false, $context);
        $result = json_decode($file);
        
        return;
    }

    static function activate() {
        self::install_cron();
    }

    static function deactivate() {
        self::uninstall_cron();
    }

    static function uninstall_cron() {
		wp_clear_scheduled_hook('hunnys_dollys_check_cron_job');
	}
	
	static function install_cron() {
		$cron_order_name = 'hunnys_dollys_check_cron_job';
		if (!wp_next_scheduled($cron_order_name)) {
            wp_schedule_event(time(), 'hourly', $cron_order_name);
        }

    }
}

new CronJobService();