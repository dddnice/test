<?php

public function getReviewerPlaceInRespectToAllNativeLanguage()
    {
        if (!$this->getNativeLang1()) {
            return;
        }

        // Get native translators.
        $nativeId = $this->getNativeLang1()->getId();

        $sql = '
		SELECT pp.user_id
		FROM wp_priority_points as pp 
		JOIN user_native_languages as m1 ON (pp.user_id=m1.user_id AND m1.native_1=:native_id)
		ORDER BY pp.points DESC
	';

        $q = Query::prepare($sql, ['native_id' => $nativeId]);
        $res = DB::instance()->get_col($q);

        $i = 1;

        foreach ($res as $id) {
            if ($id == $this->getId()) {
                break;
            }
            ++$i;
        }

        return $i;
    }
